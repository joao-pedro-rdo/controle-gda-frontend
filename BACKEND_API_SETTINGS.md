# Configurações do Sistema - Backend API

Este documento descreve as rotas de backend necessárias para o gerenciamento de configurações do sistema.

## Rotas Necessárias

### 1. Configurações Gerais do Sistema

#### GET `/settings/system`

Retorna as configurações gerais do sistema (título da página, logo, background)

**Resposta:**

```json
{
  "pageTitle": "Guarda - 6° RCB",
  "logo": "/img/logo.png",
  "background": "/img/background.jpg"
}
```

#### POST `/settings/system`

Atualiza uma ou mais configurações do sistema

**Body:**

```json
{
  "pageTitle": "Novo Título",
  "logo": "/uploads/logo.png",
  "background": "/uploads/background.jpg"
}
```

**Resposta:**

```json
{
  "success": true,
  "message": "Configurações atualizadas com sucesso"
}
```

#### POST `/settings/system/reset`

Restaura as configurações padrão do sistema

**Resposta:**

```json
{
  "success": true,
  "pageTitle": "Guarda - 6° RCB",
  "logo": "/img/logo.png",
  "background": "/img/background.jpg"
}
```

---

### 2. Gerenciamento de Destinos

#### GET `/settings/destinations`

Retorna a lista de destinos/seções disponíveis

**Resposta:**

```json
{
  "destinations": [
    "RP",
    "SFPC",
    "Cmt",
    "SCmt",
    "Estande",
    "Adj Cmdo",
    "SecInfor",
    "SecJur",
    "S1",
    "S2",
    "S3",
    "S4",
    "Pelotões",
    "SubCias",
    "Outros"
  ]
}
```

#### POST `/settings/destinations`

Adiciona um novo destino

**Body:**

```json
{
  "name": "Nova Seção"
}
```

**Resposta:**

```json
{
  "success": true,
  "destinations": ["RP", "SFPC", ..., "Nova Seção"]
}
```

#### DELETE `/settings/destinations/:name`

Remove um destino específico

**Parâmetros:**

- `name`: Nome do destino a ser removido (URL encoded)

**Resposta:**

```json
{
  "success": true,
  "destinations": ["RP", "SFPC", ...]
}
```

#### POST `/settings/destinations/reset`

Restaura a lista de destinos padrão

**Resposta:**

```json
{
  "success": true,
  "destinations": ["RP", "SFPC", "Cmt", ...]
}
```

---

## Modelo de Dados Sugerido

### Tabela: `system_settings`

```sql
CREATE TABLE system_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Registros padrão:**

```sql
INSERT INTO system_settings (setting_key, setting_value) VALUES
  ('page_title', 'Guarda - 6° RCB'),
  ('logo_path', '/img/logo.png'),
  ('background_path', '/img/background.jpg');
```

### Tabela: `destinations`

```sql
CREATE TABLE destinations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  display_order INT DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Registros padrão:**

```sql
INSERT INTO destinations (name, display_order, is_default) VALUES
  ('RP', 1, TRUE),
  ('SFPC', 2, TRUE),
  ('Cmt', 3, TRUE),
  ('SCmt', 4, TRUE),
  ('Estande', 5, TRUE),
  ('Adj Cmdo', 6, TRUE),
  ('SecInfor', 7, TRUE),
  ('SecJur', 8, TRUE),
  ('S1', 9, TRUE),
  ('S2', 10, TRUE),
  ('S3', 11, TRUE),
  ('S4', 12, TRUE),
  ('Pelotões', 13, TRUE),
  ('SubCias', 14, TRUE),
  ('Outros', 15, TRUE);
```

---

## Variáveis de Ambiente (Docker Compose)

Para configurar valores padrão via Docker Compose, adicione ao `docker-compose.yml`:

```yaml
services:
  backend:
    environment:
      - DEFAULT_PAGE_TITLE=Guarda - 6° RCB
      - DEFAULT_LOGO_PATH=/img/logo.png
      - DEFAULT_BACKGROUND_PATH=/img/background.jpg
```

Frontend:

```yaml
services:
  frontend:
    environment:
      - REACT_APP_DEFAULT_PAGE_TITLE=${DEFAULT_PAGE_TITLE:-Guarda - 6° RCB}
```

---

## Permissões

Todas as rotas de `/settings/*` devem:

- Requerer autenticação
- Estar disponíveis apenas para usuários com perfil **S2** (Super Admin)

---

## Implementação de Fallback

O frontend já está preparado para funcionar com localStorage como fallback caso o backend não esteja disponível ou não tenha implementado essas rotas ainda. Isso garante que:

1. ✅ As configurações funcionam localmente no navegador
2. ✅ Quando o backend for implementado, as configurações serão sincronizadas
3. ✅ Múltiplos usuários/dispositivos verão as mesmas configurações quando o backend estiver ativo

---

## Exemplo de Implementação (Node.js/Express)

```javascript
// routes/settings.js
const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth");

// Middleware para restringir acesso a S2
router.use(requireAuth);
router.use(requireRole("S2"));

// GET /settings/system
router.get("/system", async (req, res) => {
  try {
    const settings = await db.query(
      "SELECT setting_key, setting_value FROM system_settings"
    );

    const config = settings.reduce((acc, row) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {});

    res.json({
      pageTitle: config.page_title || "Guarda - 6° RCB",
      logo: config.logo_path || "/img/logo.png",
      background: config.background_path || "/img/background.jpg",
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar configurações" });
  }
});

// POST /settings/system
router.post("/system", async (req, res) => {
  const { pageTitle, logo, background } = req.body;

  try {
    if (pageTitle) {
      await db.query(
        "INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
        ["page_title", pageTitle, pageTitle]
      );
    }

    if (logo) {
      await db.query(
        "INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
        ["logo_path", logo, logo]
      );
    }

    if (background) {
      await db.query(
        "INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
        ["background_path", background, background]
      );
    }

    res.json({ success: true, message: "Configurações atualizadas" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar configurações" });
  }
});

// GET /settings/destinations
router.get("/destinations", async (req, res) => {
  try {
    const destinations = await db.query(
      "SELECT name FROM destinations ORDER BY display_order, name"
    );

    res.json({
      destinations: destinations.map((d) => d.name),
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar destinos" });
  }
});

// POST /settings/destinations
router.post("/destinations", async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Nome do destino é obrigatório" });
  }

  try {
    await db.query("INSERT INTO destinations (name) VALUES (?)", [name.trim()]);

    const destinations = await db.query(
      "SELECT name FROM destinations ORDER BY display_order, name"
    );

    res.json({
      success: true,
      destinations: destinations.map((d) => d.name),
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Destino já existe" });
    } else {
      res.status(500).json({ error: "Erro ao adicionar destino" });
    }
  }
});

// DELETE /settings/destinations/:name
router.delete("/destinations/:name", async (req, res) => {
  const { name } = req.params;

  try {
    await db.query("DELETE FROM destinations WHERE name = ?", [name]);

    const destinations = await db.query(
      "SELECT name FROM destinations ORDER BY display_order, name"
    );

    res.json({
      success: true,
      destinations: destinations.map((d) => d.name),
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover destino" });
  }
});

// POST /settings/destinations/reset
router.post("/destinations/reset", async (req, res) => {
  try {
    // Remove destinos customizados
    await db.query("DELETE FROM destinations WHERE is_default = FALSE");

    const destinations = await db.query(
      "SELECT name FROM destinations ORDER BY display_order, name"
    );

    res.json({
      success: true,
      destinations: destinations.map((d) => d.name),
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao resetar destinos" });
  }
});

module.exports = router;
```
