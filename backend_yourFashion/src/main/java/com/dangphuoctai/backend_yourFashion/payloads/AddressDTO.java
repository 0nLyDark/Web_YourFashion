package com.dangphuoctai.backend_yourFashion.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {

    private Long addressId;
    private String ward;
    private String buildingName;
    private String city;
    private String district;
    private String country;
    private String pincode;

}
