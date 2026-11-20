# Changes

## 1.0.0 2026-11-20

First entry of this change log, and the first release as
`@seneca/registry`. Earlier versions are on npm as `seneca-registry`
(last 0.3.2) and in the git history.

* Seneca 4: the peer dependency is `seneca` `^4.0.0`. Seneca 3 users stay
  on `seneca-registry@0`.
* Renamed from `seneca-registry` to `@seneca/registry`. The plugin name
  stays `registry`.
* Node.js 24 or later (`engines.node` `>=24`).
* The action patterns and their replies are unchanged.
* Tests run on the Node.js test runner (`node --test`) with
  `seneca.post`, instead of lab 14, code 4 and seneca-chain, which
  Seneca 4 cannot run (it calls the removed `seneca.util.parsepattern`).
  The line coverage threshold stays at 90%. The development dependencies
  are `seneca` `^4.0.0` only; `prettier` 1 and `coveralls` are removed.
* `test/example.js` and the README example use `seneca.post` instead of
  seneca-chain. `.travis.yml` (Node.js 4 to 10, Seneca 3) is removed.
