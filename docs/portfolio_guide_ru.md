# Портфолио-гайд: подготовка и публикация

Это демо-проект CRM-потока на Google Workspace (Sheets + Docs + Calendar). Все данные вымышлены, внешних интеграций и production-ID нет.

## Что проверить перед публикацией
- В `scripts/utils.gs` должны оставаться плейсхолдеры (`YOUR_DEMO_*`), а не реальные ID.
- Не хранить `.clasp.json` и токены в репозитории. Если используете clasp, добавьте файл в локальный `.gitignore`.
- В `samples/` и `docs/` лежат только вымышленные примеры; не добавляйте реальные расчеты или клиентов.

## Настройка демо окружения
1) Создайте в личном Google-аккаунте одну таблицу со вкладками из `samples/sample_sheets_structure.md`.
2) Создайте три Docs-шаблона (коммерческое, договор, счет) и при необходимости Sheet-шаблон счета. Сохраните их ID, а также ID календаря и папки архива в Drive.
3) В `scripts/utils.gs` заполните объект `CONFIG` своими демо-ID.
4) Импортируйте код в Apps Script (через UI или `clasp push` со своим `.clasp.json`). Оставьте V8 и таймзону из `appsscript.json`.
5) Заполните тестовые строки в таблице (ориентируясь на `samples/sample_data.json`).
6) Выполните `initDemoConfig()` для проверки конфигурации в логах.

## Прогон демо-сценария
1) `generateQuotationDoc(projectId)` — создает коммерческое предложение из шаблона, записывает ссылку в Sheets.
2) `generateContractDoc(projectId)` — генерирует договор с ссылкой на КП.
3) `generateInvoice(projectId, { exportPdf: true/false })` — формирует счет (Doc или Sheet) и при необходимости экспортирует PDF.
4) `upsertProjectEvent(projectId)` — создает/обновляет событие в календаре с датой, локацией и ссылками на документы.
5) Измените статус проекта на `Archived` (значение из `CONFIG.defaults`) чтобы переместить/пометить документы в архив.

## Публикация на GitHub
1) Инициализируйте git в корне проекта: `git init && git add . && git commit -m "Initial portfolio"`.
2) Добавьте удаленный репозиторий: `git remote add origin https://github.com/workflowarsenynn/event-crm-gworkspace-automation-portfolio.git`.
3) Отправьте изменения: `git push -u origin main`.

## Что можно показывать в портфолио
- Модульную структуру Apps Script (data/doc/calendar/utils).
- Документацию по архитектуре (`docs/architecture.md`) и потоку (`docs/data_flow.md`).
- Примеры схемы таблиц и фиктивных данных в `samples/`.
- Безопасность: отсутствие секретов и привязки к боевым ресурсам.
