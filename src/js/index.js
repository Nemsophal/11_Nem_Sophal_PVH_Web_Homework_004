let tasks = [
    {id: 1, name: "Java Homework", priority: "High", status: "Progress", color: "text-red-600"},
    {id: 2, name: "Korean Homework", priority: "Medium", status: "Progress", color: "text-orange-400"},
    {id: 3, name: "Java Project", priority: "Low", status: "Progress", color: "text-green-500"}
];

const listContainer = document.getElementById('taskList');
function renderTasks() {
    listContainer.innerHTML = tasks.map(task => `
        <div class="bg-white rounded-xl shadow-sm py-6 px-12 grid grid-cols-4 items-center animate-fadeIn">
            <div class="text-xl font-black text-black">${task.name}</div>
            <div class="text-center text-xl font-black ${task.color || 'text-orange-400'}">${task.priority}</div>
            <div class="text-center text-xl font-black text-black">${task.status}</div>
            <div class="flex justify-end gap-6">
                <button onclick="editTask(${task.id})" class="text-blue-700 hover:scale-110 transition-transform"><i data-lucide="square-pen" size="32"></i></button>
                <button onclick="deleteTask(${task.id})" class="text-red-600 hover:scale-110 transition-transform"><i data-lucide="trash-2" size="32"></i></button>
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

let pendingDeleteId = null;
window.toggleDeleteModal = () => {
    const modal = document.getElementById('deleteModal');
    modal.classList.toggle('hidden');
};

window.deleteTask = (id) => {
    pendingDeleteId = id;
    toggleDeleteModal();
};

window.confirmDelete = () => {
    if (pendingDeleteId !== null) {
        tasks = tasks.filter(t => t.id !== pendingDeleteId);

        renderTasks();
        toggleDeleteModal();
        pendingDeleteId = null;
    }
};

renderTasks();
let modalPriority = "Medium";
let modalColor = "text-orange-400";
let modalStatus = "Progress";

window.toggleModal = () => {
    const modal = document.getElementById('modalOverlay');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        document.getElementById('taskNameInput').value = "";
    }
};

window.setModalPriority = (p, color, btn) => {
    modalPriority = p;
    modalColor = color;
    document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('bg-red-600', 'bg-orange-400', 'bg-green-500', 'text-white'));
    const bg = color.replace('text', 'bg').replace('600', '600').replace('400', '400').replace('500', '500');
    btn.classList.add(bg, 'text-white');
};

window.setModalStatus = (s, btn) => {
    modalStatus = s;
    document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('bg-cyan-50'));
    btn.classList.add('bg-cyan-50');
};

window.saveTaskFromModal = () => {
    const nameInput = document.getElementById('taskNameInput');
    const nameValue = nameInput.value.trim();
    if (nameValue) {
        tasks.push({
            id: Date.now(),
            name: nameValue,
            priority: modalPriority,
            status: modalStatus,
            color: modalColor
        });
        renderTasks();
        toggleModal();
    } else {
        alert("Please enter a task name");
    }
};

document.getElementById('addBtn').addEventListener('click', toggleModal);

let currentEditId = null;
let editPriority = "";
let editColor = "";
let editStatus = "";

window.editTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    currentEditId = id;
    document.getElementById('updateTaskInput').value = task.name;
    editPriority = task.priority;
    editColor = task.color;
    editStatus = task.status;
    toggleUpdateModal();
};

window.toggleUpdateModal = () => {
    document.getElementById('updateModal').classList.toggle('hidden');
};

window.setUpdatePriority = (p, color, btn) => {
    editPriority = p;
    editColor = color;
    document.querySelectorAll('.update-priority-btn').forEach(b => b.classList.remove('bg-red-50', 'bg-orange-50', 'bg-green-50', 'text-white'));
    btn.classList.add(color.replace('text', 'bg').replace('600', '600').replace('400', '400').replace('500', '500'));
    const bg = color.replace('text', 'bg');
    btn.classList.remove(bg, 'text-white');
};

window.setUpdateStatus = (s, btn) => {
    editStatus = s;
    document.querySelectorAll('.update-status-btn').forEach(b => b.classList.remove('bg-cyan-50'));
    btn.classList.add('bg-cyan-50');
};

window.saveUpdate = () => {
    const newName = document.getElementById('updateTaskInput').value.trim();
    if (!newName) return alert("Task name cannot be empty");
    tasks = tasks.map(t => t.id === currentEditId ? {
        ...t,
        name: newName,
        priority: editPriority,
        status: editStatus,
        color: editColor
    } : t);
    renderTasks();
    toggleUpdateModal();
};