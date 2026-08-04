# Pendiente: transferencia a la org `nearai`

Estado actual (verificado): `StrykerUX/near-org-cms` es un repo **privado en
una cuenta GitHub Free**. En Free, un repo privado no tiene disponibles:
CODEOWNERS con "Require review from Code Owners", rulesets, ni required
status checks. `.github/CODEOWNERS` y los workflows de CI ya existen y
corren, pero hasta que se transfiera son **advisory** — visibles, pero no
bloqueantes.

Eres miembro de la org `nearai`, que tiene plan **Team** (con seats libres al
momento de escribir esto). Transferir el repo ahí desbloquea todo lo de abajo
sin costo extra. Decisión del usuario: seguir por ahora en la cuenta personal
(más simple para trabajar) y transferir después — este documento es la
checklist para ese momento, no una tarea pendiente de esta fase.

## Al transferir

1. **Settings → General → Danger Zone → Transfer ownership** → `nearai`.
2. **Reemplazar los handles placeholder** `@DESIGNER_1`/`@DESIGNER_2` en
   `.github/CODEOWNERS` por los handles reales de los diseñadores — deben
   tener acceso **write** explícito al repo, o el archivo queda inválido
   (`gh api repos/nearai/near-org-cms/codeowners/errors` lo confirma).
3. **Settings → Rules → Rulesets → New branch ruleset**, target `main`:

   | Ajuste | Valor | Por qué |
   |---|---|---|
   | Require a pull request before merging | ✅ | Sin esto, un push directo a `main` evade todo lo demás |
   | Required approvals | 1 | |
   | **Require review from Code Owners** | ✅ | Esto es lo que le da dientes al CODEOWNERS — sin este check, el archivo solo auto-solicita reviewers |
   | Dismiss stale approvals on new commits | ✅ | Evita "aprobar el diff limpio y luego pushear el cambio al núcleo" |
   | Require approval of the most recent push | ✅ | |
   | Require status checks to pass | ✅ | |
   | Checks requeridos | `typecheck · lint · build`, `manifiesto de rutas`, `zona bloqueada` | Nombres = el `name:` de cada job en `.github/workflows/*.yml`, no el nombre del workflow |
   | Require branches to be up to date | ✅ | |
   | Block force pushes | ✅ | |
   | Restrict deletions | ✅ | |
   | Bypass list | `StrykerUX` (repository admin) | Ver nota abajo |

4. **Nota sobre autoaprobación**: GitHub no permite que el autor de un PR
   apruebe su propio PR. Con un solo reviewer humano (el ingeniero), un PR
   del propio ingeniero necesita que alguien más apruebe, o usar el bypass
   list — decidir el flujo real antes de que el primer PR del ingeniero se
   quede trabado esperando su propia aprobación.
5. **Opcional, más adelante**: activar *"Require actions to be pinned to a
   full-length commit SHA"* y pinear los `uses:` de los workflows a un SHA
   en vez de a un tag — hoy los workflows usan tags de versión (`@v7.0.1`
   etc.), que es el patrón estándar y suficiente por ahora.
