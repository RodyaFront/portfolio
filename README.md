# Portfolio

Персональный сайт Rodion Hordiienko. Nuxt 4 + Vue 3 + Tailwind.

## Данные

Канон для контента — `app/data/profile.ts`.  
Исходное CV (v16) — `content/cv/HordiienkoRodionCV.md`.  
Какие работы идут на страницу — `docs/works-plan.md`.  
Стиль — `docs/design.md` (максимум UX, минимум бесполезного UI).  
Правило Cursor (ожидаемый UX): `.cursor/rules/ux.mdc`.  
Правило Cursor (копирайт без ИИ-артефактов): `.cursor/rules/content.mdc`.

Лендинг собран из профиля: шапка, hero, контакт, полка Portfolio (Ancient Lens).  
Следующий шаг - остальные кейсы из `docs/works-plan.md` по образцу Ancient Lens.

## Команды

```bash
npm run dev
npm run generate
npm run ci
npm run tech:logos
```

`ci` = typecheck + static generate (то же, что GitHub Actions перед merge в `master`).

Git: convention for agents and humans - feature branch + PR into `master`, CI green before merge. See [`docs/git-workflow.md`](docs/git-workflow.md). After clone: `git config core.hooksPath .githooks`.

`tech:logos` качает исходники в `assets/tech/source/` и пишет оптимизированные 32/64/128 WebP в `public/tech/{id}/`.
