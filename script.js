let allProducts = [];
let filteredProducts = [];
let cart = [];

        async function fetchProducts() {
            try {
                const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                if (!data.categories) throw new Error('Invalid JSON structure');
                data.categories.forEach(category => {
                    category.category_products.forEach(product => {
                        product.product_type = category.category_name;
                        allProducts.push(product);
                    });
                });
                filteredProducts = allProducts;
                displayProducts(filteredProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
                document.getElementById('products').innerHTML = '<p>Error fetching products. Please try again later.</p>';
            }
        }

        function displayProducts(products) {
            const productsDiv = document.getElementById('products');
            productsDiv.innerHTML = '';
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';

                const images = [product.image];
                if (product.second_image && product.second_image !== "empty") {
                    images.push(product.second_image);
                }

                let imageSliderHTML = '';
                if (images.length > 1) {
                    imageSliderHTML = `
                        <div class="image-slider">
                            ${images.map((src, index) => `<img src="${src}" class="slide ${index === 0 ? 'active' : ''}" alt="${product.title}">`).join('')}
                            <button class="prev" onclick="changeSlide(-1, this)">&#10094;</button>
                            <button class="next" onclick="changeSlide(1, this)">&#10095;</button>
                        </div>
                    `;
                } else {
                    imageSliderHTML = `<img src="${product.image}" alt="${product.title}" class="single-image">`;
                }

                productDiv.innerHTML = `
                    ${imageSliderHTML}
                    <h2>${product.title}</h2>
                    <p class = "vendor"><strong>${product.vendor}</strong></p>
                    <p class="category"><strong>${product.product_type}</strong></p>
                    <p class="price">Price: <strong>${product.price}</strong> <span class="compare-at-price">${product.compare_at_price}</span></p>
                    <button onclick="addToCart('${product.title}')">Add to Cart</button>
                    
                    <button onclick="buyNow(${product.id})">Buy Now</button>
                    
                    
                `;
                productsDiv.appendChild(productDiv);
            });
        }
//<button onclick="addToCart('${product.title}')">Add to Cart</button>
        function filterProducts(category) {

             // Update the active button state
            const buttons = document.querySelectorAll('.buttons button');
            buttons.forEach(button => {
                if (button.textContent === category || (category === 'All' && button.textContent === 'All')) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });

            if (category === 'All') {
                filteredProducts = allProducts;
            } else {
                filteredProducts = allProducts.filter(product => product.product_type === category);
            }
            displayProducts(filteredProducts);
        }

        function searchProducts() {
            const searchTerm = document.getElementById('search').value.toLowerCase();
            const searchedProducts = filteredProducts.filter(product =>
                product.title.toLowerCase().includes(searchTerm) ||
                product.vendor.toLowerCase().includes(searchTerm) ||
                product.product_type.toLowerCase().includes(searchTerm)
            );
            displayProducts(searchedProducts);
        }

        function updateCartButton() {
            const cartButton = document.getElementById('cart');
            cartButton.textContent = `Cart (${cart.length})`;
        }

        function buyNow(productId) {
            const product = allProducts.find(p => p.id === productId);
            alert(`You bought ${product.title}!`);
        }

        function addToCart(productTitle) {
            const product = allProducts.find(p => p.title === productTitle);
            const cartItem = cart.find(item => item.title === productTitle);
            if (cartItem) {
                cartItem.quantity += 1;
            } else {
                product.quantity = 1;
                cart.push(product);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Product added to cart!');
            updateCartButton();
            
        }

        function openCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
            window.location.href = 'cart.html';
        }

        function changeSlide(n, btn) {
            const slider = btn.parentElement;
            const slides = slider.getElementsByClassName('slide');
            let currentSlide = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        // Fetch and display products when the page loads
        fetchProducts();