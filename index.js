// Seleciona os elementos do DOM
const taskForm = document.getElementById('task-form'); // Formulário para adicionar novas tarefas
const taskInput = document.getElementById('task-input'); // Campo de texto para a descrição da tarefa
const taskDate = document.getElementById('task-date'); // Campo de data para a tarefa
const taskList = document.getElementById('task-list'); // Lista de tarefas pendentes
const concludedList = document.getElementById('concluded-list'); // Lista de tarefas concluídas

// Função para salvar tarefas no localStorage
function saveTasks() {
    const tasks = []; // Array para armazenar as tarefas pendentes
    taskList.querySelectorAll('li').forEach((taskItem) => {
        const taskText = taskItem.querySelector('span').textContent; // Obtém o texto da tarefa
        tasks.push(taskText); // Adiciona ao array
    });
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Salva as tarefas pendentes no localStorage

    const concludedTasks = []; // Array para armazenar as tarefas concluídas
    concludedList.querySelectorAll('li').forEach((taskItem) => {
        const taskText = taskItem.querySelector('span').textContent; // Obtém o texto da tarefa
        concludedTasks.push(taskText); // Adiciona ao array
    });
    localStorage.setItem('concludedTasks', JSON.stringify(concludedTasks)); // Salva as tarefas concluídas no localStorage
}

// Função para carregar tarefas do localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Carrega as tarefas pendentes ou inicializa como vazio
    tasks.forEach((taskText) => {
        const taskItem = document.createElement('li'); // Cria um elemento <li> para a tarefa
        taskItem.innerHTML = `
            <span>${taskText}</span>
            <button class="conclude-btn">Concluir</button>
        `;
        taskList.appendChild(taskItem); // Adiciona a tarefa à lista de pendentes

        const concludeButton = taskItem.querySelector('.conclude-btn'); // Botão para concluir a tarefa
        concludeButton.addEventListener('click', () => {
            const concludedItem = document.createElement('li'); // Cria um elemento <li> para a tarefa concluída
            concludedItem.innerHTML = `
                <span>${taskText}</span>
                <button class="delete-btn">Excluir</button>
            `;
            concludedList.appendChild(concludedItem); // Adiciona à lista de concluídas
            taskItem.remove(); // Remove da lista de pendentes
            saveTasks(); // Atualiza o localStorage

            const deleteButton = concludedItem.querySelector('.delete-btn'); // Botão para excluir a tarefa concluída
            deleteButton.addEventListener('click', () => {
                concludedItem.remove(); // Remove a tarefa concluída
                saveTasks(); // Atualiza o localStorage
            });
        });
    });

    const concludedTasks = JSON.parse(localStorage.getItem('concludedTasks')) || []; // Carrega as tarefas concluídas ou inicializa como vazio
    concludedTasks.forEach((taskText) => {
        const concludedItem = document.createElement('li'); // Cria um elemento <li> para a tarefa concluída
        concludedItem.innerHTML = `
            <span>${taskText}</span>
            <button class="delete-btn">Excluir</button>
        `;
        concludedList.appendChild(concludedItem); // Adiciona à lista de concluídas

        const deleteButton = concludedItem.querySelector('.delete-btn'); // Botão para excluir a tarefa concluída
        deleteButton.addEventListener('click', () => {
            concludedItem.remove(); // Remove a tarefa concluída
            saveTasks(); // Atualiza o localStorage
        });
    });
}

// Adiciona um evento de envio ao formulário
taskForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita o recarregamento da página ao enviar o formulário

    // Obtém os valores do input e da data
    const taskText = taskInput.value.trim(); // Texto da tarefa
    const taskDueDate = taskDate.value; // Data da tarefa

    // Verifica se os campos estão preenchidos
    if (taskText === '' || taskDueDate === '') {
        alert('Por favor, preencha todos os campos.'); // Alerta caso algum campo esteja vazio
        return;
    }

    const currentDate = new Date(); // Data atual
    const dueDate = new Date(taskDueDate); // Data da tarefa
    const isToday =
        dueDate.getFullYear() === currentDate.getFullYear() &&
        dueDate.getMonth() === currentDate.getMonth() &&
        dueDate.getDate() + 1 === currentDate.getDate(); // Verifica se a data é hoje

    let status; // Define o status da tarefa
    let statusClass; // Define a classe CSS com base no status
    if (dueDate < currentDate && !isToday) {
        status = 'Atrasada';
        statusClass = 'task-late';
    } else if (isToday) {
        status = 'Hoje';
        statusClass = 'task-today';
    } else if (dueDate > currentDate) {
        status = 'Futura';
        statusClass = 'task-future';
    }

    const taskItem = document.createElement('li'); // Cria um elemento <li> para a tarefa
    const formattedDate = dueDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); // Formata a data para o formato brasileiro
    taskItem.innerHTML = `
        <span>${taskText} - ${formattedDate} - ${status}</span>
        <button class="conclude-btn">Concluir</button>
    `;
    taskItem.classList.add(statusClass); // Adiciona a classe CSS correspondente ao status

    // Adiciona o item à lista de tarefas
    taskList.appendChild(taskItem);

    // Adiciona o evento de conclusão ao botão
    const concludeButton = taskItem.querySelector('.conclude-btn');
    concludeButton.addEventListener('click', () => {
        const concludedItem = document.createElement('li'); // Cria um elemento <li> para a tarefa concluída
        concludedItem.innerHTML = `
            <span>${taskText} - ${formattedDate}</span>
            <button class="delete-btn">Excluir</button>
        `;
        concludedList.appendChild(concludedItem); // Adiciona à lista de concluídas
        taskItem.remove(); // Remove da lista de pendentes
        saveTasks(); // Atualiza o localStorage

        const deleteButton = concludedItem.querySelector('.delete-btn'); // Botão para excluir a tarefa concluída
        deleteButton.addEventListener('click', () => {
            concludedItem.remove(); // Remove a tarefa concluída
            saveTasks(); // Atualiza o localStorage
        });
    });

    // Salva as tarefas no localStorage
    saveTasks();

    // Limpa os campos do formulário
    taskInput.value = ''; // Limpa o campo de texto
    taskDate.value = ''; // Limpa o campo de data
});

loadTasks(); // Carrega as tarefas do localStorage ao iniciar a página