"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {  Form, FormControl,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomFormField  from "../ui/CustomFormField";
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import{ PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, } from "@/constants"
import { RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../ui/FileUploader"
import { PatientFormDefaultValues } from "../../constants/index"


 
const RegisterForm = ({user}: { user: User }) => {
  const router = useRouter();
  const[isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit (values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    let formData;

    if(values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      })
      formData = new FormData();
      formData.append('blobFile', blobFile);
      formData.append('fileName', values.identificationDocument[0].name)
      
    }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthdate: new Date(values.birthDate),
        identificationDocument: formData,
      }
      
     const patient = await registerPatient(patientData);

     if(patient) router.push(`/patients/${user.$id}/new-appointment`)

    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
          <section className="space-y-4">
            <h1 className="header">Welcome  👋</h1>
            <p className="text-dark-700">Let us know more about you</p>
          </section>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Personal Information</h2>
            </div>
          </section>
         
         <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
            dateFormat={""}
         />

         
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="example@email.com"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
                dateFormat={""}
            />

            <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Phone Number"
                placeholder="(123) 456-789"
                iconSrc=""
                iconAlt=""
                dateFormat={""}
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthDate"
                label="Date of Birth"
                
                iconSrc=""
                iconAlt=""
                                
                
            />

            <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                label="Gender"
                              
                renderSkeleton={(field) => (
                    <FormControl>
                       <RadioGroup 
                       className="flex h-11 gap-6 xl:justify-between"
                       onValueChange={field.onChange}
                       defaultValue={field.value}
                       >
                        {GenderOptions.map((option) => (
                            <div key={option} 
                            className="radio-group">
                                <RadioGroupItem value={option} id={option}/>
                                <Label htmlFor={option} className="cursor-pointer">
                                    {option}
                                </Label>

                            </div>
                        ))}
                        </RadioGroup> 
                    </FormControl>
                )}
            />
        </div>

        

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="address"
                  label="Address"
                  placeholder="14th Street, LGA, State, Country"
                  iconSrc=""
                  iconAlt=""
                  dateFormat={""}
                  
              />

            <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="name"
                  label="Occupation"
                  placeholder="Doctor"
                  iconSrc=""
                  iconAlt=""
                  dateFormat={""}
                  
              />          

        </div>

        <div className="flex flex-col gap-6 xl:flex-row">

          <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="emergencyContactName"
                label="Emergency Contact Name"
                placeholder="Guardians's Name"
                iconSrc=""
                iconAlt=""
                dateFormat={""}
            />

            <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="emergencyContactNumber"
                label="Emergency Contact Number"
                placeholder="(123) 456-789"
                iconSrc=""
                iconAlt=""
                dateFormat={""}
            />

        </div>


        <section className="space-y-6">
          <div className="mb-9 space-y-1">
              <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>

        <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Primary Physician"
                placeholder="Select a physician"
                iconSrc=""
                iconAlt=""
                dateFormat={""}
        > 
        {Doctors.map((doctor) => (
          <SelectItem key={doctor.name} value={doctor.name}>
            <div className="flex cursor-pointer items-center gap-2">
              <Image 
                src={doctor.image}
                width={32}
                height={32}
                alt={doctor.name}
                className="rounded-full border border-dark-500"
              />
              <p>{doctor.name}</p>
            </div>

          </SelectItem>
        ) )}
        </CustomFormField>


        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="Insurance Company Name"
            iconSrc=""
            iconAlt=""
            dateFormat={""}
            
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="InsurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="ABC12345678"
            iconSrc=""
            iconAlt=""
            dateFormat={""}
            
          />          

        </div>


        
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Foods or Drugs"
            iconSrc=""
            iconAlt=""
            dateFormat={""}
            
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current Medication (if any)"
            placeholder="Drugs and Dosage form"
            iconSrc=""
            iconAlt=""
            dateFormat={""}
            
          />          

        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family Medical History"
            placeholder="Mother had brain cancer, Father had heart disease"
            iconSrc=""
            iconAlt=""
            dateFormat={""}
            
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="Appendectomy, Tonsillectomy"
            iconSrc=""
            iconAlt=""
            dateFormat={""}
            
          />          

        </div>


        <section className="space-y-6">
          <div className="mb-9 space-y-1">
              <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>


        

        <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="identificationType"
                label="Identification Type"
                placeholder="Select an Identification Type"
                iconSrc=""
                iconAlt=""
                dateFormat={""}
        > 
        {IdentificationTypes.map((type) => (
          <SelectItem key={type} value={type}>
            {type}          

          </SelectItem>
        ) )}
        </CustomFormField>


        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="1234567890"
            iconSrc=""
            iconAlt=""
            dateFormat={""}
            
          />


          <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="identificationDocument"
              label="Scanned Copy of Identification Document"
              
              renderSkeleton={(field) => (
                <FormControl>
                  <FileUploader files={field.value} onChange={field.onChange}/>
                </FormControl>
              )}         
          />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
              <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>


        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to treatment"
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to disclosure of information"
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to privacy policy"
        />
        

        




          <SubmitButton isLoading={isLoading} >
            Get Started
          </SubmitButton>
        </form>
      </Form>
    );

};

export default RegisterForm