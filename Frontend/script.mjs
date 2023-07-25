const tableBody = document.getElementById("tableBody");
const getData = () => {
    axios.get("https://tan-alert-gopher.cyclic.app/products")
    .then((res)=> {
        const data = res.data.data;
        tableBody.innerHTML = "";
        data.forEach((item) => {
          tableBody.innerHTML += `
            <tr>
              <td>${item.name}</td>
              <td>${item.price}</td>
              <td>${item.quantity}</td>
              <td>${item.description}</td>
              <td>
              <i class="fa-regular fa-pen-to-square" style="color: #235d04;" onclick="updateProduct('${item.id}', 'name')"></i>
              </td>
              <td>
                <i class="fa-solid fa-trash" style="color: #e60000;" class="delete-button" data-product-id="${item.id}"></i>
              </td>
            </tr>
          `;
        });
      })
      .catch((err) => {
        console.log(err);
        alert("Error fetching product data");
      });
  };

  const addButton = document.getElementById("add");
  addButton.addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const quantity = document.getElementById("quantity").value;
  const description = document.getElementById("description").value;

  axios.post("https://tan-alert-gopher.cyclic.app/product", {
    name: name,
    price: price,
    quantity: quantity,
    description: description,
  })
    .then((res) => {
      console.log(res);
      alert("Product Added");
      getData();
    })
    .catch((err) => {
      console.log(err);
      alert("Error adding product");
    });
});

getData();
