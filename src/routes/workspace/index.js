import deepmerge from 'deepmerge';
import moment from 'moment';
import hash from 'object-hash';
import { Component } from 'preact';
import { FaCheck, FaInbox, FaSync } from 'react-icons/fa';
import ItemList from '../../components/ItemList';
import globalStyle from '../../style/global.less';
import { generateTestTasks } from '../../tests/lib/utilities';
import style from './style.less';

const initialState = {
  tasks: generateTestTasks(), // TODO - Swap out w/ API
};

export default class Workspace extends Component {

  constructor(props) {
    super(props);
    this.state = deepmerge({}, initialState);
    this.onSelectedTask = this.onSelectedTask.bind(this);
    this.onUpdateTask = this.onUpdateTask.bind(this);
  }

  onSelectedTask(selectedTask) {
    console.log(`updating task "${selectedTask.detail}"`);

    const updatedTask = deepmerge({}, selectedTask);
    if (selectedTask.selected) {
      updatedTask.party_on = true;
      this.onUpdateTask(selectedTask, updatedTask);
      window.setTimeout(() => {
        const m = moment();
        updatedTask.completed_on = m.format();
        updatedTask.rank = m.valueOf();
        updatedTask.is_backlog = false;
        updatedTask.party_on = false;
        this.onUpdateTask(selectedTask, updatedTask);
      }, 1250);

    } else {
      updatedTask.completed_on = null;
      this.onUpdateTask(selectedTask, updatedTask);
    }
  }

  onUpdateTask(previousTask, updatedTask) {
    console.log(`updating task from "${previousTask.detail}" to "${(updatedTask || {}).detail}"`);
    console.log('before tasks', deepmerge({}, this.state.tasks))
    const tasks = deepmerge({}, this.state.tasks);
    delete tasks[previousTask.uuid];
    if (updatedTask) {
      tasks[updatedTask.uuid] = updatedTask;
    }
    this.setState({ tasks });
    console.log('after tasks', deepmerge({}, tasks))
  }

  render({ }, { tasks }) {

    const completedTasks = Object.entries(tasks)
      .filter(([uuid, task]) => !!task.completed_on)
      .map(([uuid, task]) => { task.selected = !!task.completed_on; return [uuid, task]; })
      .reduce((filteredTasks, [k, v]) => { filteredTasks[k] = v; return filteredTasks; }, {});

    const workingTasks = Object.entries(tasks)
      .filter(([uuid, task]) => !task.completed_on && !task.is_backlog)
      .map(([uuid, task]) => { task.selected = !!task.completed_on; return [uuid, task]; })
      .reduce((filteredTasks, [k, v]) => { filteredTasks[k] = v; return filteredTasks; }, {});

    const backlogTasks = Object.entries(tasks)
      .filter(([uuid, task]) => !task.completed_on && task.is_backlog)
      .map(([uuid, task]) => { task.selected = !!task.completed_on; return [uuid, task]; })
      .reduce((filteredTasks, [k, v]) => { filteredTasks[k] = v; return filteredTasks; }, {});

    return (
      <div className={style.workspace}>

        <div className={style.log}>

          <h1><FaCheck /> Completed...</h1>
          <div className={style.tasks}>
            <ItemList
              key={`completedTasks-itemList-${hash(completedTasks)}`}
              defaultItems={completedTasks}
              filter={task => !!task.completed_on}
              join={task => {
                const m = moment();
                return deepmerge.all([{}, task, {
                  completed_on: m.format(),
                  rank: m.valueOf(),
                  is_backlog: false
                }]);
              }}
              sort={(a, b) => moment(a.completed_on).isAfter(moment(b.completed_on))}
              showMove={false}
              showInsert={false}
              onSelectedItem={this.onSelectedTask}
              onUpdateItem={this.onUpdateTask}
              celebrates
            />
          </div>

          <h1><FaSync /> Working...</h1>
          <div className={style.tasks}>
            <h2>Today</h2>
            <ItemList
              key={`workingTasks-itemList-${hash(workingTasks)}`}
              defaultItems={workingTasks}
              filter={task => !task.completed_on && !task.is_backlog}
              join={task => deepmerge.all([{}, task, { completed_on: null, is_backlog: false }])}
              onSelectedItem={this.onSelectedTask}
              onUpdateItem={this.onUpdateTask}
              celebrates
            />
          </div>

          <h1><FaInbox /> Backlog...</h1>
          <div className={style.tasks}>
            <ItemList
              key={`backlogTasks-itemList-${hash(backlogTasks)}`}
              defaultItems={backlogTasks}
              filter={task => !task.completed_on && task.is_backlog}
              join={task => deepmerge.all([{}, task, { completed_on: null, is_backlog: true }])}
              onSelectedItem={this.onSelectedTask}
              onUpdateItem={this.onUpdateTask}
              celebrates
            />
          </div>

        </div>

        <div className={style.tools}>
          <p style={{ borderBottom: `2px solid ${globalStyle.primaryB}` }}>Testing</p>
          <ItemList
            defaultItems={generateTestTasks()}
            sort={(a, b) => moment(a.created_on).isAfter(moment(b.created_on))}
            draggable={false}
            onUpdateItem={this.onUpdateTask}
          />
          <p style={{ borderTop: `2px solid ${globalStyle.primaryE}` }}>Testing 2</p>
        </div>

      </div>
    );
  }
}
