package com.dangphuoctai.backend_yourFashion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dangphuoctai.backend_yourFashion.entity.Address;

@Repository
public interface AddressRepo extends JpaRepository<Address, Long> {

    Address findByCountryAndDistrictAndCityAndPincodeAndWardAndBuildingName(String country, String state, String city,
            String pincode, String street, String buildingName);

}
