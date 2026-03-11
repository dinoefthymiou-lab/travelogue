# ✦ Travelogue

A personal travel journal web app. Built with React + Supabase.

## Deploy in 15 minutes

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a project
2. In the SQL Editor, run:

```sql
create table trips (
  id bigint primary key generated always as identity,
  user_id text not null,
  data jsonb not null,
  created_at timestamp with time zone default now()
);

alter table trips enable row level security;

create policy "Users can manage their own trips"
on trips for all
using (true)
with check (true);
```

3. Go to **Settings → API** and copy your **Project URL** and **anon/public key**

---

### 2. Push to GitHub

```bash
cd travelogue
git init
git add .
git commit -m "Initial commit"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/travelogue.git
git push -u origin main
```

---

### 3. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your `travelogue` GitHub repo
3. Under **Environment Variables**, add:
   - `REACT_APP_SUPABASE_URL` → your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY` → your Supabase anon key
4. Click **Deploy**

That's it! Vercel gives you a URL like `travelogue-abc123.vercel.app` — works on any device, anywhere.

---

## Local development

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
npm install
npm start
```
