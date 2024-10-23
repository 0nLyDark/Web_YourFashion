package com.dangphuoctai.backend_yourFashion.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "stores")
@NoArgsConstructor
@AllArgsConstructor
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long storeId;

    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @Size(min = 5, max = 50, message = "Store Name must be between 5 and 50 characters long")
    // @Pattern(regexp = "^[a-zA-Z]*$", message = "Store Name must not contain
    // numbers or special characters")
    private String storeName;

    @NotBlank
    @Size(min = 10, max = 10, message = "Mobile Number must be exactly 10 digits long")
    @Pattern(regexp = "^\\d{10}$", message = "Mobile Number must contain only Numbers")
    private String mobileNumberStore;

    private String logo;

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL)
    private List<StoreCategory> storeCategories = new ArrayList<>();

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL)
    private List<Product> products = new ArrayList<>();

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(name = "store_address", joinColumns = @JoinColumn(name = "store_id"), inverseJoinColumns = @JoinColumn(name = "address_id"))
    private List<Address> addresses = new ArrayList<>();

    @OneToMany(mappedBy = "store", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    private List<Order> orders = new ArrayList<>();

    private LocalDate createdAt;
    private Integer status;
}
