/// <reference path="../typings/react/react.d.ts"/>
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="./todoApp.ts"/>
/// <reference path="./utils.ts"/>

declare class Freezer<S> {
  constructor(o: S);
  on(s: string, cb: (...o: any[]) => void): void;
  get(): S;
  trigger(s: string, ...o: any[]): void;
}

interface ITodoUI {
  status?: Serkan.Status,
  input?: string,

  set?(a: ITodoUI): ITodo
}

interface ITodoModel {
  title?: string,
  id?: string,
  completed?: boolean

  set?(a: ITodoModel): ITodo
}

interface ITodo {
  model: ITodoModel,
  ui?: ITodoUI,
  title?: string,

  pivot?(): ITodo,
  now?(): void
}

interface ITodos extends Array<ITodo> {
  pivot?(): ITodos
}

interface IState {
  todos?: ITodos;
  todoInput?: string;
  status?: Serkan.Status;
  filter?: Serkan.Filter;

  set?(a: IState): IState;
  now?(): void;
}

var State = new Freezer<IState>(Utils.store(Serkan.FREEZER_TODOS) || {
  todos: [],
  todoInput: '',
  status: Serkan.Status.READY,
  filter: Serkan.Filter.ALL
});

/**
 * Creates a new todo and add it to the list.
 * @param  {string} The todo content.
 */
State.on('todo:create', function(text: string) {

  // We set the app into a loading status
  // to let the user know
  State.get().set({ status: Serkan.Status.LOADING });

  // Call the fake server
  setTimeout(function() {
    State.get()
    // Restore the default status for the app and clean
    // the input
      .set({ status: Serkan.Status.READY, todoInput: '' })

    // Creates the new todo
      .todos.push({
        model: {
          title: text,
          id: Utils.uuid(),
          completed: false
        },
        ui: {
          status: Serkan.Status.READY,
          input: text
        }
      });

    // Save the state in localStorage
    Utils.store(Serkan.FREEZER_TODOS, State.get());
  }, Serkan.LAG);
});

/**
 * Deletes a todo.
 * @param  { FreezerNode } The todo to delete.
 */
State.on('todo:delete', function(todo: ITodo) {

  // Since we are receiving the todo to delete from
  // the arguments. We can use directly instead of
  // making use of the state.
  var updated = todo.pivot()
    .ui.set({ status: Serkan.Status.DELETING });

  setTimeout(function() {
    // We just remove the todo from teh list
    State.get()
      .todos.splice(getTodoIndex(updated), 1);

    // Save the state in localStorage
    Utils.store(Serkan.FREEZER_TODOS, State.get());
  }, Serkan.LAG);
});

/**
 * Updates a todo text. Shows how a reaction can receive more
 * than one parameter.
 *
 * @param  {FreezerNode} todo   The todo to update.
 * @param  {string} text    The new text for the todo.
 */
State.on('todo:update', function(todo: ITodo, text: string) {
  // Set the todo in an 'updating' state
  // to let the user know.
  // The updated node is returned.
  var updated = todo.pivot().ui.set({ status: Serkan.Status.UPDATING });

  // Call the server
  setTimeout(function() {
    var todo = State.get().todos[getTodoIndex(updated)];

    // We need to pivot in the node to modify multiple children.
    // Pivoting will make children changes return the updated
    // todo instead the updated child.
    todo.pivot()
      .model.set({ title: text })
      .ui.set({ status: Serkan.Status.READY })
    ;

    // Save the state in localStorage
    Utils.store(Serkan.FREEZER_TODOS, State.get());
  }, Serkan.LAG);
});

/**
 * Set a filter for the todos.
 * @param  {string} The filter to apply. It can be 'all'|'completed'|'active'.
 */
State.on('todo:filter', function(filter) {
  State.get().set({ filter: filter });

  // Save the state in localStorage
  Utils.store(Serkan.FREEZER_TODOS, State.get());
});

/**
 * Removes completed nodes from the list.
 */
State.on('todo:clearCompleted', function() {
  var i: number,
    todos = State.get().todos,
    toRemove: number[] = [];

  // Let's mark all the completed nodes as deleting
  for (var i = todos.length - 1; i >= 0; i--) {
    if (todos[i].model.completed) {
      // Pivoting makes us to have always the updated
      // reference to todos.
      todos[i].ui.set({ status: Serkan.Status.LOADING });
      todos = State.get().todos;
      toRemove.push(i);
    }
  }

  // Call the server
  setTimeout(function() {
    var todos = State.get().todos;

    // Remove all the completed children now.
    toRemove.forEach(function(i) {
      todos = todos.splice(i, 1);
    });

    // Save the state in localStorage
    Utils.store(Serkan.FREEZER_TODOS, State.get());
  }, Serkan.LAG);
});

/**
 * Marks a todo as complete or active.
 * @param {FreezerNode} The todo to toggle.
 */
State.on('todo:toggle', function(todo: ITodo) {
  todo.model.set({ completed: !todo.model.completed });

  // Save the state in localStorage
  Utils.store(Serkan.FREEZER_TODOS, State.get());
});

/**
 * HELPER function. Find a todo in the state and return
 * its index in the array.
 * @param  {FreezerNode} todo The todo to find.
 * @return {Number|Boolean}   The index or false if not found.
 */
var getTodoIndex = function(todo: ITodo) {
  var i: number,
    found = -1,
    todos = State.get().todos;

  for (i = 0; i < todos.length; i++) {
    // Since todos are immutable, we can use
    // direct comparison here instead of using uuid.
    if (todos[i] === todo) {
      found = i;
      break;
    }
  }

  return found;
};
