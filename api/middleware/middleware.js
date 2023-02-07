const User = require("../users/users-model");

function logger(req, res, next) {
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}], ${method}, ${url}`);

  next();
}

async function validateUserId(req, res, next) {
  // SİHRİNİZİ GÖRELİM

  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      res.status(404).json({
        message: "Kullanıcı id bulunamadı.",
      });
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(500).json({
      message: "İşlem yapılamadı",
    });
  }
}

function validateUser(req, res, next) {
  // SİHRİNİZİ GÖRELİM

  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      message: "gerekli name alanı eksik",
    });
  } else {
    req.name = name;
    next();
  }
}

function validatePost(req, res, next) {
  // SİHRİNİZİ GÖRELİM

  const { text } = req.body;
  if (!text) {
    res.status(400).json({ message: "gerekli text alanı eksik" });
  } else {
    req.text = text;
    next();
  }
}

// bu işlevleri diğer modüllere değdirmeyi unutmayın

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};