# План работ на страницу

Какие кейсы попадают на лендинг, какие остаются ссылкой.  
Источники: GitHub [`RodyaFront`](https://github.com/RodyaFront/), Dribbble [`Rodyaya`](https://dribbble.com/Rodyaya), CV v16.

На сайте - одна полка **Portfolio**. Вид работы на карточке: **Code and design**, **Code**, **Design**.  
Объём: 3-4 продукта + 5-6 дизайнов. Остальное - ссылки на GitHub и Dribbble.

---

## Статус

Оболочка лендинга **собрана**: канон `app/data/profile.ts`, шапка, skip-link, hero, Portfolio (горизонтальный ряд карточек + scroll), контакт, подвал. Кейсы: **Ancient Lens**, **Teotale**, **Creative Service Marketplace** (все со скринами). Карточек Design пока **нет**.

Следующий шаг: Owlika / Yaradin, затем шесть шотов Design.

Легенда у пунктов: **на странице** / **не на странице** / **не класть**.

---

## Code and design / Code

### В героя

1. **Ancient Lens** - на странице  
   Публичный shipped-продукт: [github.com/RodyaFront/ancient-lens](https://github.com/RodyaFront/ancient-lens), live [ancientlens.info](https://ancientlens.info).  
   Dota 2 match review, Nuxt 4, TypeScript, data-heavy UI, своя визуальная система.  
   Карточка с каруселью скринов, CTA Details, страница кейса `/projects/ancient-lens`.

2. **Teotale** - на странице  
   Бренд и live: [teotale.com](https://teotale.com). Private GitHub slug `VintageStoryServer` - legacy, в UI только Teotale.  
   Vintage Story multiplayer hub: accounts, whitelist, settlements, Nuxt 4 site + Node.  
   Карточка + `/projects/teotale`. GitHub → private `VintageStoryServer` (legacy slug). Dual-res шоты в `public/work/teotale/`.

3. **Creative Service Marketplace** - на странице  
   Приватный репозиторий `creative-service-marketplace`.  
   Персональный сервис арт-комиссий (портреты животных): лендинг, заказ, кабинет, админка, Stripe, auth, i18n.  
   Карточка + `/projects/creative-service-marketplace`. Visit → [creative-marketplace.duckdns.org](http://creative-marketplace.duckdns.org/). GitHub не показываем (private). Dual-res в `public/work/creative-service-marketplace/`.

4. **Owlika** - не на странице  
   Приватный репозиторий `owlika-games`.  
   Детские развивающие игры как веб-продукт: каталог, подписка, прогресс.  
   Брать, если есть что показать на экране. Если это ещё lab/доки - отложить.

5. **Yaradin / Boosta (из CV)** - частично на странице  
   Вкладка Portfolio **Under NDA** (порядок на полке):
   - **Role-based product platform** (`role-based-platform`) - Yaradin, kind **Code**; три Nuxt-приложения по ролям; без бренда продукта и без Visit. Дизайн улучшал в ревью, не владел целиком.
   - **Link analytics platform** (`link-analytics-platform`) - Boosta NDA (Spiderlink); task hub + dashboards; без бренда
   - **SEO content workspace** (`seo-content-workspace`) - Boosta NDA; публичное имя без бренда Contentball  
   Скрины только sanitized dual-res; если нельзя - NDA media: validated diagram + pitch на карточке, facts на Details (`docs/case-diagrams.md`), не выдумывать визуал и не подменять скрины диаграммой в lightbox.

### По желанию, не в героя

- **TaxCalculator** (`taxCalculator`) - не на странице. Законченный маленький инструмент (ФОП, i18n). Карточка "also built".
- **StreamCore** - не на странице. Плагины, Socket.IO, OBS. Имеет смысл только если виджеты выглядят как продукт, а не внутренний тулинг.

### Не класть на страницу

Решение принято, на лендинг не идут.

| Работа | Почему |
| --- | --- |
| `horoshop-nuxt-ts` | Тестовое приложение |
| `liveart-test` | Тестовое задание |
| `next-kanban` | Учебный showcase |
| `nuxt-ai-content-workspace` | Пустой стартер |
| `nuxt-monopoly-manager-card` | 2022, устарел |
| `site-screenshooter` | Скрипт, не кейс |
| Vintage Story C# моды | Не frontend-портфолио |
| `portfolio` | Это сам сайт |

---

## Design

С [dribbble.com/Rodyaya](https://dribbble.com/Rodyaya) на сайт выносим шесть шотов. Остальные - одной ссылкой "все работы на Dribbble".

Ссылка на Dribbble в бенто и контактах **уже есть**. Секция **Design vision** на главной: bento-галерея из шотов (`app/data/designShots.ts`, `public/design/`).

### На странице (галерея)

1. Credit card / subscription payment  
2. Authorization form (mobile)  
3. FastBite menu  
4. Pizza constructor  
5. Sports match list  
6. Messenger  
7. SaaS landing (HostMetrics)  
8. Tickets booking (Opera Nova)

### Не класть

- **Slot Machine Game UI** - gambling.  
- **Calculation** - Daily UI.  
- **AI Stickers landing** - чужой IP (Toy Story / etc.).

---

## Как показывать приватное

Приватные репозитории не открывать ради портфолио. Достаточно скринов, стека и результата.

Публичный код на странице - в первую очередь Ancient Lens и то, что можно показать без NDA.

---

## Assets (dual-res)

Каждый скрин кейса - **пара** preview + full. Не класть один webp и в страницу, и в lightbox.

- Правило агентов: `.cursor/rules/work-images.mdc`
- Скрипт: `node scripts/work-images.mjs --case <slug> --name <kebab> <source>`
- Выход: `public/work/{case}/{name}-preview.webp` + `-full.webp`, копия исходника в `assets/work/{case}/`
- Данные: `app/data/cases.ts` (`src` / `srcFull`, размеры preview и full)
- Предпочитать native-capture (long edge 1600+). Chat ~1024px годится для preview, для zoom в lightbox слабо

---

## Следующий шаг

Остальные кейсы Portfolio по образцу Ancient Lens / Teotale: Creative Service Marketplace, Owlika, Yaradin / Boosta. Затем шесть шотов Design.
