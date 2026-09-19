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
npm run tech:logos
```

`tech:logos` качает исходники в `assets/tech/source/` и пишет оптимизированные 32/64/128 WebP в `public/tech/{id}/`.
