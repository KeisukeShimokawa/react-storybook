# react-storybook

StorybookとReactを使ったComponent Driven Developmentを練習する

- [Intro to Storybook](https://www.learnstorybook.com/intro-to-storybook/)

## #1 Storybook for React tutorial

- [Get Started](https://www.learnstorybook.com/intro-to-storybook/react/en/get-started/)

用意されているテンプレートを使用して、Storybookの使い方を学んでいく。

まずは以下のコマンドで環境構築を行う。

```bash
# Clone the template
npx degit chromaui/intro-storybook-react-template taskbox

cd taskbox

# Install dependencies
yarn
```

準備が完了した後で、実際にアプリケーションを動作させてみる。

- Jestを使った単体テストの実行
- Storybookにアクセスするためのサーバ起動
- Reactアプリの起動

```bash
# Run the test runner (Jest) in a terminal:
yarn test --watchAll

# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 3000:
yarn start
```



## #2 Simple Component

では [Component Driven Development](https://www.componentdriven.org/)（CDD) という開発手法に則ってUIの構築を行っていく。

この開発手法では、ページ全体を構成するコンポーネントを1つ1つボトムアップ形式で構築していく手法である。

![](https://www.learnstorybook.com/intro-to-storybook/task-states-learnstorybook.png)

TODOアプリの作成において、**タスク** は中核となるコンポーネントであり、上記の画像を見るとわかるように複数の特徴を有している。

- タイトルを有している
- チェックボックスを有している
- チェックボックスの状態に応じて外観が変化している
- ピン留めを行うことでタスクの状態を変化させている

Storybookを使用すれば、タスクというコンポーネントに対して上記の様々な状態を反映させたコンポーネントをテストすることが可能となる。

### タスクコンポーネントの構築

では単純なタスクのコンポーネントを作成する。

ポイントはタスクにはタイトルに加えて状態を有しており、この状態はチェックボックスイベントとピン留めイベントによって変化する点である。

つまり以下のようなPropsを受け取る必要がある。

```js
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

なお現時点では状態の変化に応じて属性を変化させたりはしていない。

### Storybookによるコンポーネントのテスト

Storybookを使用して、タスクのコンポーネントが有している状態やタイトルを変更して、その外観を検査することができる。

```js
// src/components/Task.stories.js

import React from 'react';
import Task from './Task';

/**
 * export default を使ってドキュメント化したいコンポーネントを決める 
 * 
 * 下記以外にも "excludeStories" や "argTypes" を指定できる
 */
export default {
  component: Task,  // "component" で対象のコンポーネントを指定する
  title: 'Task',    // "title" でサイドバーに表示するコンポーネント名を指定する
};

// Template 変数を使用することで、複数のStoriesを短いコードで設定できる
const Template = args => <Task {...args} />;

// ".bind({})" は関数をコピーする際に使用されるテクニックである
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2018, 0, 1, 9, 0),
  },
};

// 後はデフォルトで設定した値から変更したい状態だけを指定すればいい
export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
};
```

上記のようにStorybookで管理したいコンポーネントに対して、Propsに適切な状態を与え、エクスポートすることでStorybook上でそれぞれの状態を反映したコンポーネントを確認することができる。

### Storybookの設定

あとは `.storybook` ディレクトリ内にある設定ファイルを変更すればいいだけである。

まずは管理対象のファイルを以下のように設定する。

```js
// .storybook/main.js

module.exports = {
  //👇 Location of our stories
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
};
```

次にコンポーネントのプレビューを行う際の設定をする必要があり、ここでCSSなど必要なファイルを準備しておく。

```js
// .storybook/preview.js

import '../src/index.css'; //👈 The app's CSS file goes here

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
```

上記の `parameters` では、Storybookの挙動やアドオンの設定を指定できる。ここで `actions` を指定しておくことで、正規表現に従うUIイベントが発火した際に、表示結果が正しいのかどうかテストすることができる。

### 状態を有するコンポーネントの構築

ではタスクの状態に応じてコンポーネントの外観が変わるような実装を追加する。

```js
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          defaultChecked={state === 'TASK_ARCHIVED'}
          disabled={true}
          name="checked"
        />
        <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
      </label>
      <div className="title">
        <input type="text" value={title} readOnly={true} placeholder="Input title" />
      </div>

      <div className="actions" onClick={event => event.stopPropagation()}>
        {state !== 'TASK_ARCHIVED' && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
}
```

これでそれぞれのStoryに応じてUIの外観が変化しているはずである。

![](https://www.learnstorybook.com/intro-to-storybook/finished-task-states-6-0.mp4)

### PropTypesの指定

ベストプラクティスとしては PropTypes には型を指定することが重要ではあるが、これは以下のように設定するか、あるいはTypeScriptでインターフェースを構築すればいい。

```js
// src/components/Task.js

import React from 'react';
import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  // ...
}

Task.propTypes = {
  /** Composition of the task */
  task: PropTypes.shape({
    /** Id of the task */
    id: PropTypes.string.isRequired,
    /** Title of the task */
    title: PropTypes.string.isRequired,
    /** Current state of the task */
    state: PropTypes.string.isRequired,
  }),
  /** Event to change the task to archived */
  onArchiveTask: PropTypes.func,
  /** Event to change the task to pinned */
  onPinTask: PropTypes.func,
};
```

### テストの自動化

現状ではそれぞれ構築した Story に対してブラウザ上で目視確認を行っているのみである。

ここで [Storyshot addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) を使用すれば、特定の条件でのコンポーネントの状態を保存しておき、何かしらの変更が加えられた際に、その状態を保っているのかテストを実行することができる。

```bash
yarn add -D @storybook/addon-storyshots react-test-renderer
```

あとは以下の実装を追加すれば、変更が加えられた際にテストを実行してUIが崩れていないのかテストを実行することができる。

```js
// src/storybook.test.js

import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

## #3 コンポーネントの集約

では今度はタスクのコンポーネントを集約させたタスクリストを作成することを目指す。

このタスクリストには以下のようにピン留めされたタスクを画面上部に表示する機能を有している。

![](https://www.learnstorybook.com/intro-to-storybook/tasklist-states-1.png)

またそれぞれのタスクが有しているデータは非同期的に送信されているため、データを正しく読み込みレンダリングする必要がある。
また、タスクが存在していない場合の状態も構築する必要がある。

![](https://www.learnstorybook.com/intro-to-storybook/tasklist-states-2.png)

### タスクリストを構築する

では状態によって表示させるテキストを変化させるような単純なタスクリストを作成していく。

```js
// src/components/TaskList.js

import React from 'react';
import Task from './Task';

/**
 * タスクリスト自体は、各イベントに対応するロジックと、読み込み状態を有している
 */
export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  if (loading) {
    return <div className="list-items">loading</div>;
  }

  if (tasks.length === 0) {
    return <div className="list-items">empty</div>;
  }

  return (
    <div className="list-items">
      {tasks.map(task => (
        // 複数リストを出力する場合には key による一意指定が必要となる
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

あとは同じように上記に対する Story を構築する必要がある。

```js
// src/components/TaskList.stories.js

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
```

これで以下のようにタスクリストのUIのみをテストすることができるようになった。

![](https://www.learnstorybook.com/intro-to-storybook/inprogress-tasklist-states-6-0.mp4)

### 複雑なタスクリストを作成

では複雑なタスクリストを作成する。

```js
// src/components/TaskList.js

import React from 'react';
import Task from './Task';

export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );
  if (loading) {
    return (
      <div className="list-items">
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className="list-items">
        <div className="wrapper-message">
          <span className="icon-check" />
          <div className="title-message">You have no tasks</div>
          <div className="subtitle-message">Sit back and relax</div>
        </div>
      </div>
    );
  }

  // ピン留めされたタスクが先頭に来るように並び替え
  const tasksInOrder = [
    ...tasks.filter(t => t.state === 'TASK_PINNED'),
    ...tasks.filter(t => t.state !== 'TASK_PINNED'),
  ];
  return (
    <div className="list-items">
      {tasksInOrder.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

### Jestを使ったテスト自動化

StorybookのStoriesや手動テスト、スナップショットテストでUIに発生するバグを検知することができる。

ただしタスクリストをテストする際に、ピン留めされたタスクが正しく一番上に表示されているのかであったり、タスクが正しく並び替えられているのかテストする場合には、Jestなどでテストコードによって検証したほうが確実である。

ではタスクリストに該当するテストコードを作成する。

```js
import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom/extend-expect';

import { WithPinnedTasks } from './TaskList.stories'; //👈  Our story imported here

it('renders pinned tasks at the start of the list', () => {
  const div = document.createElement('div');
  //👇 Story's args used with our test
  ReactDOM.render(<WithPinnedTasks {...WithPinnedTasks.args} />, div);

  // We expect the task titled "Task 6 (pinned)" to be rendered first, not at the end
  const lastTaskInput = div.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]');
  expect(lastTaskInput).not.toBe(null);

  ReactDOM.unmountComponentAtNode(div);
});
```

## #4 データ

コンポーネントには `Redux` などで管理されてるデータを有している可能性がある。

今回はこうしたデータを有するコンポーネントの Story をどのように構築していくのか考える。

```bash
yarn add react-redux redux
```

### Redux を使ったコンポーネントの作成

ここまでは状態を有していないコンポーネントに対して Story を作成してきた。

以下ではコンテナコンポーネントを使用してコンポーネント間でデータを繋ぐパターンを見ていく。

状態管理を行うためのライブラリである `redux` を使用する。

```js
// src/lib/redux.js

// A simple redux store/actions/reducer implementation.
// A true app would be more complex and separated into different files.
import { createStore } from 'redux';

// The actions are the "names" of the changes that can happen to the store
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
};

// The action creators bundle actions with the data required to execute them
export const archiveTask = id => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = id => ({ type: actions.PIN_TASK, id });

// All our reducers simply change the state of a single task.
function taskStateReducer(taskState) {
  return (state, action) => {
    return {
      ...state,
      tasks: state.tasks.map(task =>
        task.id === action.id ? { ...task, state: taskState } : task
      ),
    };
  };
}

// The reducer describes how the contents of the store change for each action
export const reducer = (state, action) => {
  switch (action.type) {
    case actions.ARCHIVE_TASK:
      return taskStateReducer('TASK_ARCHIVED')(state, action);
    case actions.PIN_TASK:
      return taskStateReducer('TASK_PINNED')(state, action);
    default:
      return state;
  }
};

// The initial state of our store when the app loads.
// Usually you would fetch this from a server
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

// We export the constructed redux store
export default createStore(reducer, { tasks: defaultTasks });
```
