-- ВРЕМЕННОЕ ОТКЛЮЧЕНИЕ RLS ДЛЯ ВСЕХ ТАБЛИЦ
-- Выполните этот скрипт в Supabase SQL Editor

-- 1. Отключаем RLS для всех таблиц
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE task_materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE submission_files DISABLE ROW LEVEL SECURITY;

-- 2. Удаляем все политики (чтобы не было конфликтов)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Teachers can view all profiles" ON profiles;

DROP POLICY IF EXISTS "Anyone can view tasks" ON tasks;
DROP POLICY IF EXISTS "Teachers can create tasks" ON tasks;
DROP POLICY IF EXISTS "Teachers can update their own tasks" ON tasks;
DROP POLICY IF EXISTS "Teachers can delete their own tasks" ON tasks;

DROP POLICY IF EXISTS "Anyone can view task materials" ON task_materials;
DROP POLICY IF EXISTS "Teachers can create task materials" ON task_materials;

DROP POLICY IF EXISTS "Students can view their own submissions" ON submissions;
DROP POLICY IF EXISTS "Students can create their own submissions" ON submissions;
DROP POLICY IF EXISTS "Students can update their own submissions" ON submissions;
DROP POLICY IF EXISTS "Teachers can view all submissions" ON submissions;
DROP POLICY IF EXISTS "Teachers can update submissions for their tasks" ON submissions;

DROP POLICY IF EXISTS "Users can view submission files for accessible submissions" ON submission_files;
DROP POLICY IF EXISTS "Students can create submission files for their submissions" ON submission_files;

-- 3. Проверяем статус RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'tasks', 'task_materials', 'submissions', 'submission_files')
ORDER BY tablename;

-- 4. Тестовый запрос
SELECT 'RLS disabled successfully' as status;
