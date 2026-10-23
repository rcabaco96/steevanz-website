@AGENTS.md

# Memória do projeto

As regras e o conhecimento acumulados com o dono (sites de clientes, menus digitais, marca, chatbot, anúncios,
leitor de reviews) estão aqui e valem para qualquer conta do Claude:

@.claude/memoria-do-projeto.md

# Paid APIs: never spend balance (absolute rule from the owner)

Never run anything that spends balance on DataForSEO, Apify or any other paid API: no scripts,
probes, tests, re-imports, manual dispatches or hand-run routines, however small the cost. Paid
actions happen only when the owner presses a button on the site. Free reads are fine (DataForSEO
`appendix/user_data`, `task_get`/`tasks_ready` of results already paid). If something can only be
checked by spending, say so and ask the owner to use the site's button.
