-- ФИНАЛЬНОЕ ИСПРАВЛЕНИЕ RLS ПОЛИТИК
-- Выполните этот скрипт в Supabase SQL Editor

-- 1. Удаляем все старые политики для profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Teachers can view all profiles" ON profiles;

-- 2. Создаем новые правильные политики для profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- КРИТИЧЕСКИ ВАЖНО: Политика для учителей - могут видеть ВСЕ профили
CREATE POLICY "Teachers can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role = 'teacher'
    )
  );

-- 3. Исправляем политики для submissions
DROP POLICY IF EXISTS "Teachers can view all submissions" ON submissions;
CREATE POLICY "Teachers can view all submissions" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role = 'teacher'
    )
  );

-- 4. Проверяем, что RLS включен
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_files ENABLE ROW LEVEL SECURITY;

-- 5. Тестовый запрос для проверки
SELECT 'RLS policies fixed successfully' as status;
