const express = require("express");
const {
  logger,
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");

const UserModel = require("./users-model");
const PostModel = require("../posts/posts-model");

// `users-model.js` ve `posts-model.js` sayfalarına ihtiyacınız var
// ara yazılım fonksiyonları da gereklidir

const router = express.Router();

router.get("/", (req, res, next) => {
  // TÜM KULLANICILARI İÇEREN DİZİYİ DÖNDÜRÜN
  UserModel.get()
    .then((users) => {
      res.json(users);
    })
    .catch(next); // en alttaki error middleware'e yönlendirmiş oluyoruz.
});

router.get("/:id", validateUserId, (req, res, next) => {
  // USER NESNESİNİ DÖNDÜRÜN
  // user id yi getirmek için bir ara yazılım gereklidir
  res.json(req.user);
  next();
});

router.post("/", validateUser, (req, res, next) => {
  // YENİ OLUŞTURULAN USER NESNESİNİ DÖNDÜRÜN
  // istek gövdesini doğrulamak için ara yazılım gereklidir.
  UserModel.insert({ name: req.name })
    .then((newUser) => {
      res.status(200).json(newUser);
    })
    .catch(next);
});

router.put("/:id", validateUserId, validateUser, async (req, res, next) => {
  // YENİ GÜNCELLENEN USER NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan ara yazılım gereklidir
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.

  try {
    await UserModel.update(req.params.id, { name: req.name });
    const updatedUser = await UserModel.getById(req.params.id);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  // SON SİLİNEN USER NESNESİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.

  try {
    await UserModel.remove(req.params.id);
    res.json(req.user);
  } catch (err) {
    next(err);
  }
});

// router.get("/posts", (req, res, next) => {

//   PostModel.get()
//     .then((posts) => {
//       res.json(posts);
//     })
//     .catch(next);
// });

router.get("/:id/posts", validateUserId, async (req, res, next) => {
  // USER POSTLARINI İÇEREN BİR DİZİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.

  try {
    const posts = await UserModel.getUserPosts(req.params.id);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
  // YENİ OLUŞTURULAN KULLANICI NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.

  try {
    const result = await PostModel.insert({
      user_id: req.params.id,
      text: req.text,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

//error middleware
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: "bir şeyler yanlış gitti.",
    message: err.message,
  });
});

// routerı dışa aktarmayı unutmayın

module.exports = router;