# Reminder App

予定管理が苦手な自分のために作った、メモ＋Telegram通知のリマインダーWebアプリ。

タスク管理ツールの完成形（[鬼管](https://github.com/inoara0220-svg/task-reminder-web)）を作るにあたって、その基本機能である「リマインド機能」を先に単体で実装したプロジェクト。

---

## 機能

- メールアドレス・パスワードによるユーザー認証（サインアップ / ログイン / ログアウト）
- メモの作成・編集・削除
- 指定した日時にTelegramへ通知を送信
- 繰り返し通知（日次 / 週次 / 月次 / 年次）
- インライン編集（テキスト・日時をクリックして直接編集）

---

## 使用技術

| カテゴリ | 技術 |
|----------|------|
| バックエンド | Python / Flask |
| データベース | SQLite / Flask-SQLAlchemy |
| 認証 | Flask-Login / Werkzeug（パスワードハッシュ化） |
| 通知 | Telegram Bot API |
| スケジューラー | APScheduler（1分ごとにリマインダーをチェック） |
| フロントエンド | HTML (Jinja2) / JavaScript (Fetch API) |

---

## 開発で苦労した点

**HTTPリクエストの概念理解**  
Webアプリ開発自体が初めてだったため、フォームのsubmit後に同じユーザーへ同じページを返すという処理が最初イメージできなかった。ユーザーとしてWebを使ってきた感覚と、実際のHTTPリクエスト・レスポンスの仕組みのギャップに詰まり、基礎から調べながら理解していった。

**通知の挙動が不安定だった問題**  
新規登録したリマインダーは通知が届くのに、編集後のリマインダーは通知が来ないケースが発生した。原因を調査したところ、編集時に通知済みフラグがリセットされていなかったことが原因だった。編集で日時が変更された場合にフラグを`False`に戻す処理を追加して解決した。

---

## 工夫した点

機能を増やすより、基本機能の使いやすさにこだわった。

- テキストや日時をクリックするだけでインライン編集できる
- カレンダーアイコンからも日程入力ができる
- キーボード操作とマウス操作の両方に対応

---

## セットアップ

```bash
git clone https://github.com/inoara0220-svg/reminder
cd reminder
pip install -r requirements.txt
```

`.env`ファイルを作成：
```
SECRET_KEY=your_secret_key
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

```bash
python main.py
```

---

## ファイル構成

```
reminder/
├── main.py              # 起動エントリーポイント
└── website/
    ├── __init__.py      # アプリ初期化・スケジューラー設定
    ├── auth.py          # 認証（ログイン・サインアップ）
    ├── views.py         # メイン機能（CRUD）
    ├── models.py        # DBモデル（User / Note）
    ├── notify.py        # Telegram通知
    ├── static/
    │   └── index.js     # フロントエンドロジック
    └── templates/       # HTMLテンプレート
```
