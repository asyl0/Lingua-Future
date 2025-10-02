-- Исправление RLS политик для устранения бесконечной рекурсии
-- Выполните этот скрипт в Supabase SQL Editor

-- Удаляем существующие политики
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Teachers can view all profiles" ON profiles;

-- Удаляем политики для tasks
DROP POLICY IF EXISTS "Anyone can view tasks" ON tasks;
DROP POLICY IF EXISTS "Teachers can create tasks" ON tasks;
DROP POLICY IF EXISTS "Teachers can update their own tasks" ON tasks;
DROP POLICY IF EXISTS "Teachers can delete their own tasks" ON tasks;

-- Удаляем политики для task_materials
DROP POLICY IF EXISTS "Anyone can view task materials" ON task_materials;
DROP POLICY IF EXISTS "Teachers can create task materials" ON task_materials;

-- Удаляем политики для submissions
DROP POLICY IF EXISTS "Students can view their own submissions" ON submissions;
DROP POLICY IF EXISTS "Students can create their own submissions" ON submissions;
DROP POLICY IF EXISTS "Students can update their own submissions" ON submissions;
DROP POLICY IF EXISTS "Teachers can update submissions for their tasks" ON submissions;

-- Удаляем политики для submission_files
DROP POLICY IF EXISTS "Users can view submission files for accessible submissions" ON submission_files;
DROP POLICY IF EXISTS "Students can create submission files for their submissions" ON submission_files;

-- Создаем исправленные политики для profiles (без рекурсии)
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Создаем политики для tasks (без рекурсии)
CREATE POLICY "Anyone can view tasks" ON tasks
  FOR SELECT USING (true);

CREATE POLICY "Teachers can create tasks" ON tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'teacher'
    )
  );

CREATE POLICY "Teachers can update their own tasks" ON tasks
  FOR UPDATE USING (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'teacher'
    )
  );

CREATE POLICY "Teachers can delete their own tasks" ON tasks
  FOR DELETE USING (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'teacher'
    )
  );

-- Создаем политики для task_materials
CREATE POLICY "Anyone can view task materials" ON task_materials
  FOR SELECT USING (true);

CREATE POLICY "Teachers can create task materials" ON task_materials
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN profiles p ON t.created_by = p.id
      WHERE t.id = task_id AND p.id = auth.uid() AND p.role = 'teacher'
    )
  );

-- Создаем политики для submissions
CREATE POLICY "Students can view their own submissions" ON submissions
  FOR SELECT USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN profiles p ON t.created_by = p.id
      WHERE t.id = task_id AND p.id = auth.uid() AND p.role = 'teacher'
    )
  );

CREATE POLICY "Students can create their own submissions" ON submissions
  FOR INSERT WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'student'
    )
  );

CREATE POLICY "Students can update their own submissions" ON submissions
  FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "Teachers can update submissions for their tasks" ON submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN profiles p ON t.created_by = p.id
      WHERE t.id = task_id AND p.id = auth.uid() AND p.role = 'teacher'
    )
  );

-- Создаем политики для submission_files
CREATE POLICY "Users can view submission files for accessible submissions" ON submission_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM submissions s
      WHERE s.id = submission_id AND (
        s.student_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM tasks t
          JOIN profiles p ON t.created_by = p.id
          WHERE t.id = s.task_id AND p.id = auth.uid() AND p.role = 'teacher'
        )
      )
    )
  );

CREATE POLICY "Students can create submission files for their submissions" ON submission_files
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM submissions s
      JOIN profiles p ON s.student_id = p.id
      WHERE s.id = submission_id AND s.student_id = auth.uid() AND p.role = 'student'
    )
  );