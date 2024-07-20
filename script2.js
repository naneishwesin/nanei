$(document).ready(function() {
    var nextProductId = 1;
    var deletedProductIds = [];
    var vatRate = 0.07;

    // Load initial data from JSON
    $.getJSON('data.json', function(data) {
        var accessories = data.accessories;
        var accessorySelect = $("#accessory");

        accessories.forEach(function(accessory) {
            var option = $("<option></option>")
                .attr("value", accessory.price)
                .text(accessory.name + " - $" + accessory.price);
            accessorySelect.append(option);
        });
    });

    $("#addButton").click(function() {
        addToProductList();
    });

    $("#saveNewProduct").click(function() {
        addToProductList(true);
    });

    $("#openModalButton").click(function() {
        $("#modalForm").css("display", "flex");
    });

    $(".close").click(function() {
        $("#modalForm").css("display", "none");
    });

    $(window).click(function(event) {
        if (event.target.id === "modalForm") {
            $("#modalForm").css("display", "none");
        }
    });

    function addToProductList(fromModal = false) {
        var accessoryName, accessoryPrice, amount;

        if (fromModal) {
            accessoryName = $("#newProductName").val();
            accessoryPrice = parseFloat($("#newProductPrice").val());
            amount = parseInt($("#newAmount").val());
        } else {
            var accessoryOption = $("#accessory option:selected");
            accessoryName = accessoryOption.text();
            accessoryPrice = parseFloat(accessoryOption.val());
            amount = parseInt($("#amount").val());
        }

        if (amount > 0 && accessoryPrice > 0 && accessoryName !== "") {
            var productId = nextProductId;
            if (deletedProductIds.length > 0) {
                productId = deletedProductIds.shift();
            } else {
                nextProductId++;
            }

            var newRow = $("<tr></tr>").attr("data-id", productId);
            newRow.append($("<td></td>").text(productId));
            newRow.append($("<td></td>").text(accessoryName));
            newRow.append($("<td></td>").text(amount));
            newRow.append($("<td></td>").text((accessoryPrice * amount).toFixed(2)));
            newRow.append($("<td></td>").append('<button class="deleteButton">Delete</button>'));

            $("#productList tbody").append(newRow);
            updateTotalPrice();

            if (fromModal) {
                $("#modalForm").css("display", "none");
                $("#newProductName").val("");
                $("#newProductPrice").val("");
                $("#newAmount").val(1);
            } else {
                $("#amount").val(1);
            }
        } else {
            alert("Please enter valid product details.");
        }
    }

    function updateTotalPrice() {
        var totalPrice = 0;
        $("#productList tbody tr").each(function() {
            var price = parseFloat($(this).find("td").eq(3).text());
            totalPrice += price;
        });

        $("#totalPrice").text(totalPrice.toFixed(2));

        var vatAmount = totalPrice * vatRate;
        var totalWithVAT = totalPrice + vatAmount;

        $("#totalWithVAT").text(totalWithVAT.toFixed(2));

        var discountRate = parseFloat($("#discount").val()) / 100;
        var discountedTotalPrice = totalPrice * (1 - discountRate);
        var discountedTotalWithVAT = discountedTotalPrice * (1 + vatRate);

        $("#discountedTotalPrice").text(discountedTotalPrice.toFixed(2));
        $("#discountedTotalWithVAT").text(discountedTotalWithVAT.toFixed(2));
    }

    $("#productList").on("click", ".deleteButton", function() {
        var row = $(this).closest("tr");
        var productId = row.data("id");
        deletedProductIds.push(productId);
        row.remove();
        updateTotalPrice();
    });
});