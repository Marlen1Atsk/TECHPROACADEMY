// Επιλογή των στοιχείων από το DOM
const todoList = document.getElementById('todoList'); // Λίστα με τα tasks
const newTodoInput = document.getElementById('newTodo'); // Πεδίο εισαγωγής νέου task
const filterTodoSelect = document.getElementById('filterTodo'); // Επιλογέας φίλτρου tasks
const searchTodoInput = document.getElementById('searchTodo'); // Πεδίο αναζήτησης tasks
const themeToggleBtn = document.getElementById('themeToggle'); // Κουμπί εναλλαγής θέματος

// Καθολική μεταβλητή για τον έλεγχο του χρώματος tasks
let isBeige = true;

// Συνάρτηση που επιστρέφει τυχαίο χρώμα μεταξύ beige και light brown
function getRandomColor() {
  const beige = '#F5F5DC';
  const lightBrown = '#D2B48C';
  isBeige = !isBeige;
  return isBeige ? beige : lightBrown;
}

// Συνάρτηση για το φιλτράρισμα των tasks ανάλογα με την επιλογή
function filterTodos(filter) {
  localforage.getItem('todos').then((todos) => {
    todos = todos || [];
    let filteredTodos = [];

    switch (filter) {
      case 'completed':
        filteredTodos = todos.filter((todo) => todo.completed);
        break;
      case 'incomplete':
        filteredTodos = todos.filter((todo) => !todo.completed);
        break;
      default:
        filteredTodos = todos;
    }

    renderFilteredTodos(filteredTodos);
  });
}

// Συνάρτηση για την αναζήτηση των tasks με βάση το κείμενο
function searchTodos(searchText) {
  localforage.getItem('todos').then((todos) => {
    todos = todos || [];
    const filteredTodos = todos.filter((todo) =>
      todo.text.toLowerCase().includes(searchText.toLowerCase())
    );

    renderFilteredTodos(filteredTodos);
  });
}

// Συνάρτηση για την αρχική εμφάνιση όλων των tasks
function renderTodos() {
  localforage.getItem('todos').then((todos) => {
    todos = todos || [];
    renderFilteredTodos(todos);
  });
}

// Συνάρτηση για την εμφάνιση των tasks με βάση το φίλτρο
function renderFilteredTodos(filteredTodos) {
  todoList.innerHTML = '';

  filteredTodos.forEach((todo) => {
    const listItem = document.createElement('li');
    const taskColor = todo.color || getRandomColor();

    listItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    listItem.setAttribute('data-id', todo.id);
    listItem.style.backgroundColor = taskColor;

    listItem.innerHTML = `
      <span>${todo.text}</span>
      <button onclick="editTodo(${todo.id})" class="edit-button">Edit</button>
      <button onclick="toggleCompletion(${todo.id})" class="complete-button">Complete</button>
      <button onclick="deleteTodo(${todo.id})" class="delete-button">Delete</button>
    `;
    todoList.appendChild(listItem);
  });
}

// Συνάρτηση για την προσθήκη ενός νέου task
function addTodo() {
  const newTodoText = newTodoInput.value.trim();
  if (newTodoText !== '') {
    localforage.getItem('todos').then((todos) => {
      todos = todos || [];
      const newTodo = { id: Date.now(), text: newTodoText, completed: false, color: getRandomColor() };
      todos.push(newTodo);
      localforage.setItem('todos', todos).then(() => {
        newTodoInput.value = '';
        renderTodos();
      });
    });
  }
}

// Συνάρτηση για την εναλλαγή της ολοκλήρωσης ενός task
function toggleCompletion(id) {
  localforage.getItem('todos').then((todos) => {
    todos = todos || [];
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    localforage.setItem('todos', updatedTodos).then(() => {
      renderTodos();
    });
  });
}

// Συνάρτηση για την επεξεργασία ενός task
function editTodo(id) {
  const listItem = document.querySelector(`.todo-item[data-id="${id}"]`);
  const span = listItem.querySelector('span');
  const currentText = span.innerText;

  const updatedText = prompt('Edit the task:', currentText);

  if (updatedText !== null) {
    localforage.getItem('todos').then((todos) => {
      todos = todos || [];
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, text: updatedText } : todo
      );
      localforage.setItem('todos', updatedTodos).then(() => {
        renderTodos();
      });
    });
  }
}

// Συνάρτηση για την διαγραφή ενός task
function deleteTodo(id) {
  localforage.getItem('todos').then((todos) => {
    todos = todos || [];
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    localforage.setItem('todos', updatedTodos).then(() => {
      renderTodos();
    });
  });
}

// Συνάρτηση για την εναλλαγή φωτεινού/σκοτεινού θέματος
themeToggleBtn.addEventListener('click', toggleTheme);

function toggleTheme() {
  const body = document.body;
  body.classList.toggle('dark-theme');
}

//επιλογή φίλτρου
filterTodoSelect.addEventListener('change', () => {
  const selectedFilter = filterTodoSelect.value;
  filterTodos(selectedFilter);
});

// εισαγωγή κειμένου στο πεδίο αναζήτησης
searchTodoInput.addEventListener('input', () => {
  const searchText = searchTodoInput.value.trim();
  searchTodos(searchText);
});

// Αρχική εμφάνιση των tasks
renderTodos();
