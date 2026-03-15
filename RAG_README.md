# RAG System: Square → DuckDB → Claude

A Retrieval-Augmented Generation pipeline that syncs data from **Square** (catalog, orders, inventory, customers) into **DuckDB**, generates vector embeddings, and uses **Claude** to answer natural-language questions about your store.

---

## Architecture

```
Square API
  ↓  (squareService.js — catalog, orders, inventory, customers)
DuckDB tables (sq_catalog_items, sq_orders, sq_inventory, sq_customers)
  ↓  (embeddingService.js — OpenAI text-embedding-3-small)
DuckDB rag_chunks table with FLOAT[1536] embeddings + HNSW index (vss extension)
  ↓  (ragService.js — embed query → similarity search → Claude prompt)
RAG HTTP endpoint: POST /api/rag/query
```

Sync is triggered by a cron job (every 6h) and/or on-demand via `POST /api/rag/sync`.

---

## New Dependencies

```bash
npm install square duckdb-async openai @anthropic-ai/sdk node-cron
```

| Package | Purpose |
|---|---|
| `square` | Official Square Node SDK |
| `duckdb-async` | Promise-based DuckDB Node driver |
| `openai` | `text-embedding-3-small` embeddings |
| `@anthropic-ai/sdk` | Claude generation (Haiku 3.5) |
| `node-cron` | In-process cron for auto-sync |

---

## Environment Variables

Add these to your `.env`:

```env
# Square
SQUARE_ACCESS_TOKEN=EAAAl...
SQUARE_ENVIRONMENT=sandbox
SQUARE_LOCATION_ID=LXXXXXXXX

# DuckDB
DUCKDB_PATH=./data/rag.duckdb

# OpenAI (embeddings)
OPENAI_API_KEY=sk-...

# Anthropic (generation)
ANTHROPIC_API_KEY=sk-ant-...

# RAG tuning
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=1536
RAG_TOP_K=5
RAG_LLM=claude-3-5-haiku-20241022

# Sync schedule (node-cron format)
SYNC_CRON_SCHEDULE=0 */6 * * *
```

---

## DuckDB Schema

Run `node scripts/setupDuckDB.js` once before first launch. It creates:

```sql
INSTALL vss; LOAD vss;

CREATE TABLE IF NOT EXISTS sq_catalog_items (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description VARCHAR,
    category_name VARCHAR,
    price_cents INTEGER,
    currency VARCHAR DEFAULT 'USD',
    is_archived BOOLEAN DEFAULT false,
    synced_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS sq_inventory (
    catalog_item_id VARCHAR PRIMARY KEY,
    quantity DECIMAL(10,2),
    state VARCHAR,
    location_id VARCHAR,
    synced_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS sq_orders (
    id VARCHAR PRIMARY KEY,
    customer_id VARCHAR,
    state VARCHAR,
    total_cents INTEGER,
    currency VARCHAR DEFAULT 'USD',
    line_items_json VARCHAR,
    created_at TIMESTAMP,
    synced_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS sq_customers (
    id VARCHAR PRIMARY KEY,
    given_name VARCHAR,
    family_name VARCHAR,
    email_address VARCHAR,
    phone_number VARCHAR,
    created_at TIMESTAMP,
    synced_at TIMESTAMP DEFAULT current_timestamp
);

-- RAG knowledge base: embedded text chunks
CREATE TABLE IF NOT EXISTS rag_chunks (
    id VARCHAR PRIMARY KEY,
    source_type VARCHAR NOT NULL,   -- 'catalog', 'order', 'inventory', 'customer'
    source_id VARCHAR NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding FLOAT[1536],
    created_at TIMESTAMP DEFAULT current_timestamp
);

-- HNSW index for fast vector similarity search
CREATE INDEX IF NOT EXISTS rag_chunks_hnsw
    ON rag_chunks USING HNSW (embedding) WITH (metric = 'cosine');
```

---

## Files to Create / Modify

### New files

| File | Role |
|---|---|
| `database/duckdb.js` | Singleton DuckDB connection (mirrors `database/mongodb.js` pattern) |
| `scripts/setupDuckDB.js` | One-time DDL runner — run before first start |
| `services/squareService.js` | Fetches catalog, orders, inventory, customers from Square SDK |
| `services/duckdbService.js` | UPSERT helpers + `similaritySearch()` using `array_cosine_similarity` |
| `services/embeddingService.js` | `embedText(str)` and `embedBatch(strs[])` via OpenAI |
| `services/ragService.js` | `runFullSync()` orchestrator + `ragQuery(question)` pipeline |
| `controllers/ragController.js` | HTTP handlers: query, sync trigger, status |
| `routes/rag/api.js` | Route definitions with `authenticate` middleware |
| `middleware/adminAuth.js` | Optional: restricts `/sync` to admin users by JWT ID |

### Modified files

| File | Change |
|---|---|
| `app.js` | Add `connectDuckDB()`, `ragRoutes`, and cron job init |
| `.env` / `.env.example` | Add 11 new env vars above |
| `package.json` | 5 new dependencies |
| `.gitignore` | Add `data/` |

---

## Implementation Steps

### Step 1 — Infrastructure
1. `npm install square duckdb-async openai @anthropic-ai/sdk node-cron`
2. Create `database/duckdb.js` — async singleton using `Database.create(path)`, installs `vss` on first connect
3. Create `scripts/setupDuckDB.js` — runs all CREATE TABLE + CREATE INDEX DDL
4. Run `node scripts/setupDuckDB.js` to bootstrap schema
5. Add `connectDuckDB()` call to `app.js`

### Step 2 — Square Sync Layer
6. Create `services/squareService.js` with `fetchCatalogItems()`, `fetchOrders()`, `fetchInventory(ids)`, `fetchCustomers()`
   - Must handle cursor-based pagination (loop while `result.cursor` exists)
7. Create `services/duckdbService.js` with `upsertRows(table, rows)`, `upsertChunk({...})`, `similaritySearch(embedding, topK)`

### Step 3 — Embedding Layer
8. Create `services/embeddingService.js` with `embedText()` and `embedBatch()` via OpenAI

   Text templates per source type:
   - **catalog**: `"Product: {name}. Category: {category}. Description: {desc}. Price: ${price}."`
   - **order**: `"Order {id}, status {state}, total ${total}. Items: {summary}."`
   - **inventory**: `"Item {id} has {qty} units in state {state}."`

### Step 4 — RAG Orchestration
9. Create `services/ragService.js`:
   - `runFullSync()` — fetch Square → upsert DuckDB → embed → upsert `rag_chunks`
   - `ragQuery(question)` — embed question → similarity search → Claude prompt → `{ answer, sources }`

### Step 5 — HTTP Layer
10. Create `controllers/ragController.js` — `postRagQuery`, `postSync` (202 Accepted + async), `getSyncStatus`
11. Create `routes/rag/api.js` — wire 3 routes with `authenticate` middleware
12. Register `ragRoutes` in `app.js`

### Step 6 — Cron
13. Add `node-cron` schedule in `app.js` calling `runFullSync()` per `SYNC_CRON_SCHEDULE`

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/rag/query` | JWT | Ask a natural-language question |
| `POST` | `/api/rag/sync` | JWT | Trigger a full Square → DuckDB sync |
| `GET` | `/api/rag/status` | JWT | Row counts per table |

### Query request/response

```json
// POST /api/rag/query
{ "question": "What fruits do you have in stock?" }

// Response
{
  "answer": "Based on the store data, the available fruits are: ...",
  "sources": [
    { "id": "catalog_ABC123", "type": "catalog", "score": 0.91, "text": "Product: Apple..." }
  ]
}
```

---

## Verification

```bash
# 1. Schema bootstrap
node scripts/setupDuckDB.js
# Expected: "DuckDB schema ready."

# 2. Start server
npm start

# 3. Get a JWT (login first)
curl -X POST http://localhost:8000/api/login/signIn \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}' \
  -c cookies.txt

# 4. Trigger sync
curl -X POST http://localhost:8000/api/rag/sync -b cookies.txt
# Expected: { "message": "Sync started." }

# 5. Check status (wait a few seconds)
curl http://localhost:8000/api/rag/status -b cookies.txt
# Expected: { "sq_catalog_items": N, "sq_orders": N, "rag_chunks": N }

# 6. Ask a question
curl -X POST http://localhost:8000/api/rag/query \
  -H "Content-Type: application/json" -b cookies.txt \
  -d '{"question": "What fruits do you have in stock?"}'

# 7. Verify existing routes still work
curl -X GET http://localhost:8000/api/items -b cookies.txt
```

---

## Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Vector store | DuckDB `vss` extension | No extra infra; same SQL queries; one `.duckdb` file |
| Embedding model | `text-embedding-3-small` | Best cost/quality ratio; 1536-dim; ~$0.02/1M tokens |
| Generation LLM | Claude 3.5 Haiku | Fast, cheap, Anthropic ecosystem |
| Sync trigger | Cron + on-demand HTTP | Cron keeps data fresh; HTTP allows manual refresh |
| Square data | Catalog, Orders, Inventory, Customers | Full product + transaction + stock knowledge |

---

## Production Notes

- **Square pagination**: Both `listCatalog` and `searchOrders` return a `cursor` when more pages exist — loop until `cursor` is null
- **Batch embedding**: Cap at 2,000 texts per OpenAI call
- **DuckDB concurrency**: Single-writer, multiple-reader — safe for one in-process Express server
- **PII**: Consider not embedding raw customer contact info; embed anonymized order summaries instead
- **Webhooks**: Square's `catalog.version.updated` and `order.created` webhooks can replace/supplement the cron for real-time sync
- **`.gitignore`**: Add `data/` to avoid committing the `.duckdb` file
