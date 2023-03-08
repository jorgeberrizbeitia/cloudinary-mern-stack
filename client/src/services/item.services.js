import service from "./config.services";

const createOneItemService = (newItem) => {
  return service.post("/item", newItem);
};

const getAllItemsService = () => {
  return service.get("/item");
};

export { createOneItemService, getAllItemsService };
