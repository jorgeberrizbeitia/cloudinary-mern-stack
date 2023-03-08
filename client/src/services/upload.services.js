import service from "./config.services"

const uploadImageService = (imageFile) => {
  return service.post("/upload", imageFile)
}

export {
  uploadImageService
}