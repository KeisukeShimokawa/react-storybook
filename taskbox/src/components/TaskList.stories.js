import React from 'react';
import TaskList from './TaskList';
import * as TaskStories from './Task.stories';

/**
 * decorators を使用して、コンポーネントをレンダリングする際の余白を設定している
 * イメージとしては画面の青い部分の余白を設定している
 */
export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
};

// タスクリストのテンプレートを作成して、それぞれコピーの作成を行う
const Template = args => <TaskList {...args} />;


export const Default = Template.bind({});
Default.args = {
  // 引数に Story となるそれぞれコンポーネントを設定している
  // 子コンポーネントの Story からデフォルト引数を読み込んで使っている
  tasks: [
    { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
    { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
    { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
    { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
    { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
    { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
  ],
};

// 最後の1個だけ、タスクをピン止め状態にする
export const WithPinnedTasks = Template.bind({});
WithPinnedTasks.args = {
  tasks: [
    ...Default.args.tasks.slice(0, 5),
    { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
  ],
};

// タスクが存在しない場合に、正しく画面に文字がレンダリングされるのか
export const Loading = Template.bind({});
Loading.args = {
  tasks: [],
  loading: true,
};

// タスクのデータを読み込んでいる場合に、正しく画面に文字がレンダリングされるのか
export const Empty = Template.bind({});
Empty.args = {
  ...Loading.args,
  loading: false,
};