# react-storybook

StorybookとReactを使ったComponent Driven Developmentを練習する

- [Intro to Storybook](https://www.learnstorybook.com/intro-to-storybook/)

## #1 Storybook for React tutorial

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
