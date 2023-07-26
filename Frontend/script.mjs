// const tableBody = document.getElementById("tableBody");
// const getData = () => {
//     axios.get("https://tan-alert-gopher.cyclic.app/products")
//     .then((res)=> {
//         const data = res.data.data;
//         tableBody.innerHTML = "";
//         data.forEach((item) => {
//           tableBody.innerHTML += `
//             <tr>
//               <td>${item.name}</td>
//               <td>${item.price}</td>
//               <td>${item.quantity}</td>
//               <td>${item.description}</td>
//               <td>
//               <i class="fa-regular fa-pen-to-square" style="color: #235d04;" onclick="updateProduct('${item.id}', 'name')"></i>
//               </td>
//               <td>
//                 <i class="fa-solid fa-trash" style="color: #e60000;" class="delete-button" data-product-id="${item.id}"></i>
//               </td>
//             </tr>
//           `;
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//         alert("Error fetching product data");
//       });
//   };

//   const addButton = document.getElementById("add");
//   addButton.addEventListener("click", () => {
//   const name = document.getElementById("name").value;
//   const price = document.getElementById("price").value;
//   const quantity = document.getElementById("quantity").value;
//   const description = document.getElementById("description").value;

//   axios.post("https://tan-alert-gopher.cyclic.app/product", {
//     name: name,
//     price: price,
//     quantity: quantity,
//     description: description,
//   })
//     .then((res) => {
//       console.log(res);
//       alert("Product Added");
//       getData();
//     })
//     .catch((err) => {
//       console.log(err);
//       alert("Error adding product");
//     });
// });

// getData();


const tableBody = document.getElementById("tableBody");
const getData = () => {
  axios.get("https://tan-alert-gopher.cyclic.app/products")
    .then((res) => {
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
              <i class="fas fa-pen" style="color: #235d04; cursor: pointer; font-size: 20px;" onclick="editProduct('${item._id}', '${item.name}', '${item.price}', '${item.quantity}', '${item.description}')"></i>
              <i class="fas fa-check" style="color: green; cursor: pointer; font-size: 20px; display: none;" onclick="updateProduct('${item._id}', '${item.name}', '${item.price}', '${item.quantity}', '${item.description}')"></i>
              <i class="fas fa-times" style="color: red; cursor: pointer; font-size: 20px; display: none;" onclick="cancelEdit()"></i>
            </td>
            <td>
              <i class="fas fa-trash" style="color: #e60000; cursor: pointer; font-size: 20px;" onClick="deleteProduct('${item._id}')"></i>
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

const deleteProduct = (id) => {
    axios.delete(`https://tan-alert-gopher.cyclic.app/product/${id}`)
      .then((res) => {
        if (res.data && res.data.message === "product is deleted") {
          console.log(res);
          alert("Product Deleted");
          getData(); // Refresh the table data after delete
        } else {
          console.log(res);
          alert("Product not found or already deleted");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error deleting product");
      });
  };

let editedProduct = null;

const editProduct = (id, name, price, quantity, description) => {
  editedProduct = { id, name, price, quantity, description };

  document.querySelectorAll(".fa-pen, .fa-trash").forEach(icon => icon.style.display = "none");
  document.querySelectorAll(".fa-check, .fa-times").forEach(icon => icon.style.display = "inline");
};

const cancelEdit = () => {
  editedProduct = null;
  document.querySelectorAll(".fa-pen, .fa-trash").forEach(icon => icon.style.display = "inline");
  document.querySelectorAll(".fa-check, .fa-times").forEach(icon => icon.style.display = "none");
};

const updateProduct = (id, name, price, quantity, description) => {
  if (editedProduct && editedProduct.id === id) {
    const updatedName = name;
    const updatedPrice = price;
    const updatedQuantity = quantity;
    const updatedDescription = description;

    axios.put(`https://tan-alert-gopher.cyclic.app/product/${id}`, {
      name: updatedName,
      price: updatedPrice,
      quantity: updatedQuantity,
      description: updatedDescription,
    })
      .then((res) => {
        console.log(res);
        alert("Product Updated");
        getData();
        editedProduct = null;
        document.querySelectorAll(".fa-pen, .fa-trash").forEach(icon => icon.style.display = "inline");
        document.querySelectorAll(".fa-check, .fa-times").forEach(icon => icon.style.display = "none");
      })
      .catch((err) => {
        console.error(err);
        alert("Error updating product");
      });
  }
};

getData();

