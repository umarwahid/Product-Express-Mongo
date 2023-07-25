const tableBody = document.getElementById("tableBody");
const getData = () => {
    axios.get("https://rich-erin-bison-tie.cyclic.app/products")
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

  const inputforms = document.getElementById("inputforms");
inputforms.addEventListener("submit", (event) => {
  event.preventDefault();
  axios.post("https://rich-erin-bison-tie.cyclic.app/product", {
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    quantity: document.getElementById("quantity").value,
    description: document.getElementById("description").value,
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
