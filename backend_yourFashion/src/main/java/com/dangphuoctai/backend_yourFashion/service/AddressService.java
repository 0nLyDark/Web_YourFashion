package com.dangphuoctai.backend_yourFashion.service;

import java.util.List;

import com.dangphuoctai.backend_yourFashion.entity.Address;
import com.dangphuoctai.backend_yourFashion.payloads.AddressDTO;

public interface AddressService {

    AddressDTO createAddress(AddressDTO addressDTO);

    List<AddressDTO> getAddresses();

    AddressDTO getAddress(Long addressId);

    AddressDTO updateAddress(Long addressId, Address address);

    String deleteAddress(Long addressId);
}