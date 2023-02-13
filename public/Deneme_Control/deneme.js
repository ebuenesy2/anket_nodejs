	for (var i = 0; i < db.length; i++) {
					
					
					//! Arama - Company
					const dbFind_company = db_company.find(u => u.token == dbLimit[i].companyToken);
					var companyTitle = null;
					
					if (dbFind_company) { companyTitle = dbFind_company.titleofcompany; }
					
					//! Güncelleme
					dbLimit[i].companyTitle = companyTitle;
					//! Arama - Company Son
					
					//! Arama - Category
					const dbFind_category = db_category.find(u => u.token == dbLimit[i].categoryToken);
					var categoryTitle = null;
					
					if (dbFind_category) { categoryTitle = dbFind_category.categoryTitle; }
					
					//! Güncelleme
					dbLimit[i].categoryTitle = categoryTitle;
					//! Arama - Category Son
					
										
					//! Arama - Brand
					const dbFind_brand = db_brand.find(u => u.token == dbLimit[i].brandToken);
					var brandTitle = null;
					
					if (dbFind_brand) { brandTitle = dbFind_brand.brandTitle; }
					
					//! Güncelleme
					dbLimit[i].brandTitle = brandTitle;
					//! Arama - Brand Son
					
					 //! Arama - Options
					const dbFind_options = db_product_options.filter(u => u.productId == dbLimit[i].id);
					var optionsList = null;
					
					if (dbFind_options) { optionsList = dbFind_options; }
					
					//! Güncelleme
					dbLimit[i].options = optionsList;
					//! Arama - Options Son
					
				}