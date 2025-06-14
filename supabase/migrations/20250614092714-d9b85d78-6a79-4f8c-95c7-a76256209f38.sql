
-- Create an 'exams' table to support the application
CREATE TABLE public.exams (
  id SERIAL PRIMARY KEY,
  patient_name VARCHAR(255) NOT NULL,
  exam_type VARCHAR(255) NOT NULL,
  exam_date DATE NOT NULL DEFAULT now(),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pendente', 'concluido')),
  files TEXT[] NOT NULL DEFAULT '{}',
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Optionally, add an index on status for filtering
CREATE INDEX idx_exams_status ON public.exams(status);

-- Optionally, add an index on exam_date for sorting
CREATE INDEX idx_exams_exam_date ON public.exams(exam_date);
