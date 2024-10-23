package com.dangphuoctai.backend_yourFashion.payloads;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreDTO {

    private Long id;
    private String email;
    private String storeName;
    private String mobileNumberStore;
    private String logo;
    private AddressDTO address;
    private LocalDate createdAt;
    private Integer status;
}
