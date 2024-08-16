// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6lYlAUFhoCFdSMCgNZ6Yj7nkAbdylLW0",
  authDomain: "consultorio-36325.firebaseapp.com",
  projectId: "consultorio-36325",
  storageBucket: "consultorio-36325.appspot.com",
  messagingSenderId: "769474857871",
  appId: "1:769474857871:web:c0db873662b19efe8259fa"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let consultationValue = 100;
let editPassword = '102030';
let tempPassword = '';

// Save consultation value
function saveConsultationValue() {
    consultationValue = parseFloat(document.getElementById('consultationValue').value);
    alert('Valor da consulta salvo com sucesso!');
    updateMonthlyReport();
    updateCommissionCalculations();
}

// Carrega funcionários ao iniciar
document.addEventListener('DOMContentLoaded', function() {
    showSection('consultations');
    carregarFuncionarios();
    carregarConsultas();
    carregarMedicos();
    updateMonthlyReport();
    updateCurrentDate();
    updateAttendanceMonthLabel();
    updateSurgeryMonthLabel();
    updateDashboardMonthLabel();
    updatePatientSelect();
});

// Salvar Funcionário
document.getElementById('employeeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const employeeName = document.getElementById('employeeName').value;
    salvarFuncionario(employeeName);
    document.getElementById('employeeForm').reset();
});

// Salvar Médico
document.getElementById('doctorForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const doctorName = document.getElementById('doctorName').value;
    salvarMedico(doctorName);
    document.getElementById('doctorForm').reset();
});

// Salvar Consulta
document.getElementById('consultationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const patientName = document.getElementById('patientName').value;
    const cpf = document.getElementById('cpf').value;
    const phone = document.getElementById('phone').value;
    const employee = document.getElementById('employeeSelect').value;
    const paymentDate = document.getElementById('paymentDate').value;
    const consultationDate = document.getElementById('consultationDate').value;
    const paymentProof = document.getElementById('paymentProof').files[0];

    const consulta = { patientName, cpf, phone, employee, paymentDate, consultationDate, paymentProof, status: 'ativo' };
    salvarConsulta(consulta);
    document.getElementById('consultationForm').reset();
});

// Salvar Funcionário no Firebase
function salvarFuncionario(nomeFuncionario) {
  db.collection("funcionarios").add({
    nome: nomeFuncionario,
    status: 'ativo'
  })
  .then((docRef) => {
    console.log("Funcionário adicionado com ID: ", docRef.id);
    alert('Funcionário cadastrado com sucesso!');
    carregarFuncionarios(); // Atualiza a lista após o cadastro
  })
  .catch((error) => {
    console.error("Erro ao adicionar funcionário: ", error);
  });
}

// Carregar Funcionários do Firebase
function carregarFuncionarios() {
  db.collection("funcionarios").get().then((querySnapshot) => {
    const employeeList = document.getElementById('employeeList');
    employeeList.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const employee = doc.data();
      const li = document.createElement('li');
      li.innerHTML = `
        ${employee.nome} (${employee.status})
        <button class="edit" onclick="toggleEmployeeStatus('${doc.id}', '${employee.status}')">
          ${employee.status === 'ativo' ? 'Desativar' : 'Ativar'}
        </button>
      `;
      employeeList.appendChild(li);
    });
  });
}

// Alternar Status do Funcionário
function toggleEmployeeStatus(employeeId, currentStatus) {
  const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
  db.collection("funcionarios").doc(employeeId).update({
    status: newStatus
  })
  .then(() => {
    console.log("Status do funcionário atualizado");
    carregarFuncionarios(); // Atualiza a lista após a atualização
  })
  .catch((error) => {
    console.error("Erro ao atualizar status: ", error);
  });
}

// Salvar Médico no Firebase
function salvarMedico(nomeMedico) {
  db.collection("medicos").add({
    nome: nomeMedico,
    status: 'ativo'
  })
  .then((docRef) => {
    console.log("Médico adicionado com ID: ", docRef.id);
    alert('Médico cadastrado com sucesso!');
    carregarMedicos(); // Atualiza a lista após o cadastro
  })
  .catch((error) => {
    console.error("Erro ao adicionar médico: ", error);
  });
}

// Carregar Médicos do Firebase
function carregarMedicos() {
  db.collection("medicos").get().then((querySnapshot) => {
    const doctorList = document.getElementById('doctorList');
    doctorList.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const doctor = doc.data();
      const li = document.createElement('li');
      li.innerHTML = `
        ${doctor.nome} (${doctor.status})
        <button class="edit" onclick="toggleDoctorStatus('${doc.id}', '${doctor.status}')">
          ${doctor.status === 'ativo' ? 'Desativar' : 'Ativar'}
        </button>
      `;
      doctorList.appendChild(li);
    });
  });
}

// Alternar Status do Médico
function toggleDoctorStatus(doctorId, currentStatus) {
  const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
  db.collection("medicos").doc(doctorId).update({
    status: newStatus
  })
  .then(() => {
    console.log("Status do médico atualizado");
    carregarMedicos(); // Atualiza a lista após a atualização
  })
  .catch((error) => {
    console.error("Erro ao atualizar status: ", error);
  });
}

// Salvar Consulta no Firebase
function salvarConsulta(consulta) {
  db.collection("consultas").add(consulta)
  .then((docRef) => {
    console.log("Consulta adicionada com ID: ", docRef.id);
    alert('Consulta cadastrada com sucesso!');
    carregarConsultas(); // Atualiza a lista após o cadastro
  })
  .catch((error) => {
    console.error("Erro ao adicionar consulta: ", error);
  });
}

// Carregar Consultas do Firebase
function carregarConsultas() {
  db.collection("consultas").get().then((querySnapshot) => {
    const consultationList = document.getElementById('consultationList');
    consultationList.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const consulta = doc.data();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${consulta.patientName}</td>
        <td>${consulta.cpf}</td>
        <td>${consulta.phone}</td>
        <td>${consulta.employee}</td>
        <td>${consulta.paymentDate}</td>
        <td>${consulta.consultationDate}</td>
        <td>${consulta.paymentProof ? 'Ver Comprovante' : ''}</td>
        <td>${consulta.status}</td>
        <td>
          <button class="edit" onclick="deactivateConsultation('${doc.id}')">Desativar</button>
        </td>
      `;
      consultationList.appendChild(row);
    });
  });
}

// Desativar Consulta
function deactivateConsultation(consultaId) {
  const password = prompt("Digite a senha para desativar:");
  if (password !== editPassword && password !== tempPassword) {
    alert('Senha incorreta!');
    return;
  }
  const reason = prompt("Digite o motivo da desativação:");
  db.collection("consultas").doc(consultaId).update({
    status: `inativo (${reason})`
  })
  .then(() => {
    console.log("Consulta desativada com sucesso");
    carregarConsultas(); // Atualiza a lista após a desativação
  })
  .catch((error) => {
    console.error("Erro ao desativar consulta: ", error);
  });
}

function updatePatientSelect() {
  const patientSelect = document.getElementById('patientSelect');
  patientSelect.innerHTML = '';
  db.collection("consultas").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const consulta = doc.data();
      if (consulta.status === 'ativo') {
        const option = document.createElement('option');
        option.value = consulta.patientName;
        option.textContent = consulta.patientName;
        patientSelect.appendChild(option);
      }
    });
  });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    if (sectionId === 'dashboard') {
        updateDashboard();
    }
}

// Outras funções de manipulação do DOM e cálculo de comissão continuam aqui...
