-- Create journals table
create table journals (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create homework table
create table homework (
  id uuid default uuid_generate_v4() primary key,
  classroom_id uuid references classrooms(id) on delete cascade,
  teacher_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  due_date timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reminders table
create table reminders (
  id uuid default uuid_generate_v4() primary key,
  classroom_id uuid references classrooms(id) on delete cascade,
  teacher_id uuid references profiles(id) on delete cascade,
  title text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies for journals
alter table journals enable row level security;

create policy "Students can view their own journals"
  on journals for select
  using (auth.uid() = student_id);

create policy "Teachers can view journals of their students"
  on journals for select
  using (
    exists (
      select 1 from classroom_students cs
      join classrooms c on c.id = cs.classroom_id
      where cs.student_id = journals.student_id
      and c.teacher_id = auth.uid()
    )
  );

create policy "Students can create their own journals"
  on journals for insert
  with check (auth.uid() = student_id);

-- Add RLS policies for homework
alter table homework enable row level security;

create policy "Teachers can manage their classroom homework"
  on homework for all
  using (teacher_id = auth.uid());

create policy "Students can view homework in their classrooms"
  on homework for select
  using (
    exists (
      select 1 from classroom_students cs
      where cs.classroom_id = homework.classroom_id
      and cs.student_id = auth.uid()
    )
  );

-- Add RLS policies for reminders
alter table reminders enable row level security;

create policy "Teachers can manage their classroom reminders"
  on reminders for all
  using (teacher_id = auth.uid());

create policy "Students can view reminders in their classrooms"
  on reminders for select
  using (
    exists (
      select 1 from classroom_students cs
      where cs.classroom_id = reminders.classroom_id
      and cs.student_id = auth.uid()
    )
  ); 