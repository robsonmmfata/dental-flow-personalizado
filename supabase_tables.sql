-- Tabela patients
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  birthDate DATE,
  cpf VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  emergencyContact VARCHAR(255),
  emergencyPhone VARCHAR(50),
  allergies TEXT,
  medications TEXT,
  notes TEXT,
  preferredDoctor VARCHAR(255),
  status VARCHAR(10) CHECK (status IN ('ativo', 'inativo')),
  lastVisit DATE,
  nextAppointment DATE,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela transactions (financial)
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(10) CHECK (type IN ('receita', 'despesa')) NOT NULL,
  value NUMERIC(10,2) NOT NULL,
  category VARCHAR(100),
  status VARCHAR(10) CHECK (status IN ('confirmado', 'pendente')) NOT NULL,
  patientId INTEGER REFERENCES patients(id),
  appointmentId INTEGER,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela doctors
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cro VARCHAR(50),
  specialty VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  status VARCHAR(10) CHECK (status IN ('ativo', 'inativo')),
  createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela budgets
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  patientName VARCHAR(255) NOT NULL,
  procedures TEXT[] NOT NULL,
  totalValue NUMERIC(10,2) NOT NULL,
  paymentMethod VARCHAR(100),
  status VARCHAR(10) CHECK (status IN ('pendente', 'pago', 'vencido')),
  createdAt DATE NOT NULL,
  dueDate DATE NOT NULL
);

-- Tabela appointments
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  patientName VARCHAR(255) NOT NULL,
  patientId INTEGER REFERENCES patients(id),
  doctorName VARCHAR(255) NOT NULL,
  doctorId INTEGER REFERENCES doctors(id),
  dentist VARCHAR(255),
  date DATE NOT NULL,
  time VARCHAR(10) NOT NULL,
  service VARCHAR(255) NOT NULL,
  status VARCHAR(15) CHECK (status IN ('agendado', 'confirmado', 'concluido', 'cancelado')),
  notes TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);
