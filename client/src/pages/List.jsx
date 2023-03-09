import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllItemsService } from "../services/item.services";

function List() {
  const navigate = useNavigate();

  const [allItems, setAllItems] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await getAllItemsService();
      setAllItems(response.data);
      setIsFetching(false);
    } catch (error) {
      navigate("/error");
    }
  };

  if (isFetching === true) {
    return <h3>... loading</h3>
  }

  return (
    <div>
      <h1>List of Items</h1>

      {allItems.length > 0 ? (
        <div>
          {allItems.map((eachItem) => {
            return (
              <div>
                <h3>{eachItem.name}</h3>
                <div>
                  <img src={eachItem.image} alt="img" width={200} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <h3>There are no items</h3>
      )}
    </div>
  );
}

export default List;
