import Swal from "sweetalert2";
import {
  createRecordForm,
  recordGroup,
  recordNetTotal,
  recordRowTemplate,
  recordTax,
  recordTotal,
} from "./selectors";
import products from "./states";
// import { v4 as uuidv4 } from 'uuid';

export const createRecordFormHandler = (event) => {
  event.preventDefault();
  //   console.log("record form");
  //    console.log( data.get("product_select"))
  //   console.log(data.get("quantity"));

  const data = new FormData(createRecordForm);
  const currentProduct = products.find(
    ({id}) =>id == data.get("product_select")
  );

  const isExistedRecord = document.querySelector(`[product-id='${currentProduct.id}']`)
   if(isExistedRecord === null){
  recordGroup.append(recordRow(currentProduct, data.get("quantity")));
   }else{
    Swal.fire({
      title: `Are you sure to add quantity to ${currentProduct.name}?`,
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
  
      confirmButtonText: "Yes, add it!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateQuantity(isExistedRecord.getAttribute("product-id"),parseInt(data.get("quantity")))
      }
    });
   }
  createRecordForm.reset();
};

export const calculateTax = (amount, percentage = 5) =>
  (amount / 100) * percentage;

export const calculateRecordTotal = () => {
  let total = 0;
  recordGroup
    .querySelectorAll(".record-cost")
    .forEach((el) => (total += parseFloat(el.innerText)));

  return total;
};

export const recordRow = ({ id, name, price }, quantity) => {
  const recordProductRow = recordRowTemplate.content.cloneNode(true);
  const recordRowProductName = recordProductRow.querySelector(
    ".record-product-name"
  );
  const recordRowProductPrice = recordProductRow.querySelector(
    ".record-product-price"
  );
  const recordRowQuantity = recordProductRow.querySelector(".record-quantity");
  const recordRowCost = recordProductRow.querySelector(".record-cost");
  const currentRecordRow = recordProductRow.querySelector(".record-row");
  currentRecordRow.setAttribute("product-id", id);
  //   currentRecordRow.setAttribute("id", uuidv4());

  recordRowProductName.innerText = name;
  recordRowProductPrice.innerText = price;
  recordRowQuantity.innerText = quantity;
  recordRowCost.innerText = quantity * price;

  return recordProductRow;
};

export const recordRemove = (rowId) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "question",
    showCancelButton: true,

    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const currentRecord = recordGroup.querySelector(
        `[product-id='${rowId}']`
      );
      currentRecord.remove();
    }
  });
};

// export const quantityAdd = (rowId) => {
//   const currentRecord = recordGroup.querySelector(`[product-id='${rowId}']`)
//   const recordRowProductPrice = currentRecord.querySelector(
//     ".record-product-price"
//   );
//   const recordRowQuantity = currentRecord.querySelector(".record-quantity");
//   const recordRowCost = currentRecord.querySelector(".record-cost");
//   recordRowQuantity.innerText  = parseInt(recordRowQuantity.innerText) + 1;
//   recordRowCost.innerText = recordRowProductPrice.innerText * recordRowQuantity.innerText 
// }
// export const quantitySubtract = (rowId) => {
//   const currentRecord = recordGroup.querySelector(`[product-id='${rowId}']`)
//   const recordRowProductPrice = currentRecord.querySelector(
//     ".record-product-price"
//   );
//   const recordRowQuantity = currentRecord.querySelector(".record-quantity");
//   const recordRowCost = currentRecord.querySelector(".record-cost");
//   if(recordRowQuantity.innerText > 1){
//     recordRowQuantity.innerText  = parseInt(recordRowQuantity.innerText) - 1;
//   recordRowCost.innerText = recordRowProductPrice.innerText * recordRowQuantity.innerText 
//   }
// }

export const updateQuantity = (rowId,newQuantity) => {
  const currentRecord = recordGroup.querySelector(`[product-id='${rowId}']`)
  const recordRowProductPrice = currentRecord.querySelector(
    ".record-product-price"
  );
  const recordRowQuantity = currentRecord.querySelector(".record-quantity");
  const recordRowCost = currentRecord.querySelector(".record-cost");

  if(newQuantity>0 || recordRowQuantity.innerText>1){
    recordRowQuantity.innerText =parseInt( recordRowQuantity.innerText) + newQuantity ;
  }
  recordRowCost.innerText = recordRowProductPrice.innerText * recordRowQuantity.innerText 

}

export const recordGroupHandler = (event) => {
  if (event.target.classList.contains("record-remove")) {
    const currentRecord = event.target.closest(".record-row");
    recordRemove(currentRecord.getAttribute("product-id"));
  } else if (event.target.classList.contains("quantity-add")) {
    const currentRecord = event.target.closest(".record-row")
    updateQuantity((currentRecord.getAttribute("product-id")),1)
   }else if (event.target.classList.contains("quantity-sub")) {
     const currentRecord = event.target.closest(".record-row")
     updateQuantity((currentRecord.getAttribute("product-id")),-1)
    }
};

export const recordGroupObserver = () => {
  const observerOptions = {
    childList: true,
    subtree: true,
  };

  const updateTotal = () => {
    const total = calculateRecordTotal();
    const tax = calculateTax(total);
    recordTotal.innerText = total;
    recordTax.innerText = tax;
    recordNetTotal.innerText = total + tax;
  };
  const observer = new MutationObserver(updateTotal);
  observer.observe(recordGroup, observerOptions);
};
