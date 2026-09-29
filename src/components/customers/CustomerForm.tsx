"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { Customer } from "@/types";
import { Field, FormModal, inputCls } from "@/components/layout/ui";

type Props = {
  customer: Customer | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function CustomerForm({
  customer,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState({
    name: customer?.name ?? "",
    email: customer?.email ?? "",
    contact: customer?.contact ?? "",
    address: customer?.address ?? "",
  });

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.name.trim()) {
      throw new Error("Name is required.");
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      throw new Error("Enter a valid email address.");
    }

    if (!form.contact.trim()) {
      throw new Error("Contact is required.");
    }

    if (!form.address.trim()) {
      throw new Error("Address is required.");
    }

    // EDIT existing customer
    if (customer) {
      await api.customers.update(customer.id, form);
    }

    // CREATE new customer
    else {
      await api.customers.create(form);
    }

    // Tell parent component that saving is complete
    onSaved();
  };

  return (
    <FormModal
      title={customer ? "Edit Customer" : "New Customer"}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Field label="Name">
        <input
          className={inputCls}
          value={form.name}
          onChange={handleChange("name")}
          placeholder="Enter customer name"
        />
      </Field>

      <Field label="Email">
        <input
          type="email"
          className={inputCls}
          value={form.email}
          onChange={handleChange("email")}
          placeholder="Enter email"
        />
      </Field>

      <Field label="Contact">
        <input
          className={inputCls}
          value={form.contact}
          onChange={handleChange("contact")}
          placeholder="Enter contact number"
        />
      </Field>

      <Field label="Address">
        <input
          className={inputCls}
          value={form.address}
          onChange={handleChange("address")}
          placeholder="Enter address"
        />
      </Field>
    </FormModal>
  );
}

