-- Тестовый скрипт для проверки подключения к Supabase
-- Выполните этот скрипт в Supabase SQL Editor

-- Проверяем, что таблица profiles существует и доступна
SELECT COUNT(*) as total_profiles FROM profiles;

-- Проверяем, что есть студенты
SELECT COUNT(*) as total_students FROM profiles WHERE role = 'student';

-- Проверяем, что есть учителя
SELECT COUNT(*) as total_teachers FROM profiles WHERE role = 'teacher';

-- Проверяем RLS политики
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Проверяем, что можем читать данные профилей
SELECT id, name, surname, role FROM profiles LIMIT 5;