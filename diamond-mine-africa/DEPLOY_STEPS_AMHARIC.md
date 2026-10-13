# Diamond Mine Africa — የመጨረሻ ማስነሻ ዝርዝር

## 1. Environment Variables በVercel ላይ

Vercel → Project → Settings → Environment Variables ግባ፣ ከዚያ የሚከተሉትን ጨምር (Production, Preview, Development ምረጥ):

- `VITE_SUPABASE_URL` = `https://tetcwuirxyejgewxzsyb.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = ከSupabase Project Settings → API Keys ውስጥ `sb_publishable_...` ቁልፉን ቅዳ።
- `VITE_DEMO_MODE` = `true`

`sb_secret`, `service_role`, ወይም database password በ`VITE_` variables ውስጥ አታስገባ። እውነተኛ `.env` ፋይልን ወደ GitHub አትጫን።

## 2. Supabase — SMS የለም

Supabase Dashboard → Authentication → Sign In / Providers:

1. Phone sign-in አንቃ።
2. Phone confirmation/verification ን OFF አድርግ።
3. SMS provider አታዋቅር።

Phone confirmation ከበራ ምዝገባ የSMS ማረጋገጫ ይፈልጋል። ካጠፋኸው ግን ተጠቃሚዎች የሌላ ሰው ስልክ ቁጥር በመጠቀም ሊመዘገቡ ይችላሉ፤ ስለዚህ ይህ ለዴሞ/ሙከራ ብቻ ነው።

## 3. Database Migration

ቀድሞ የተፈጠሩትን 16 ሰንጠረዦች የያዘውን `supabase_schema.sql` እንደገና አታስኬድ። የPlatform Rules migration ገና ካልተስኬደ ብቻ `supabase/migrations/202610130001_accept_platform_rules.sql` በSQL Editor አንድ ጊዜ አስኬድ።

## 4. GitHub ላይ የSource Code ማዘመን

1. ZIP አውርድና አውጣ።
2. በውስጡ ያለውን `diamond-mine-africa` ፎልደር ክፈት።
3. የዚያ ፎልደር ይዘቶችን በGitHub Repository root ውስጥ በተመሳሳይ መንገዶች አስገባ/ተካ። ZIP ፋይሉን ብቻ አትጫን፤ ያ ኮድን አያዘምንም።
4. ለውጦች ሲጠናቀቁ `Commit changes` ተጫን።

## 5. በVercel ላይ Deploy

1. Vercel → Project → Settings ውስጥ Framework `Vite`, Build Command `npm run build`, Output Directory `dist` መሆናቸውን አረጋግጥ።
2. ከላይ ያሉት Environment Variables መኖራቸውን አረጋግጥ።
3. Commit ካደረግክ በኋላ Vercel Deployments ክፈትና Build Log ተመልከት። ከተሳካ በኋላ signup/login, refresh, logout, Rules acknowledgement ፈትሽ።

## የአሁኑ ገደቦች

Supabase Auth/Profile lookup የdevelopment integration ነው። VIP purchase/claims, demo balances, check-in, tasks, referral commission, recharge/withdrawal እና admin flows አሁንም localStorage/demo ናቸው። እውነተኛ ገንዘብ አትቀበል። `VITE_DEMO_MODE=true` አቆይ።
