import pydicom
from pydicom.dataset import Dataset, FileDataset
from pydicom.uid import ExplicitVRLittleEndian
import datetime
import numpy as np

def create_fake_dicom(filename, patient_name="BROWN^JAMES", modality="CT"):
    # Create file metadata
    file_meta = Dataset()
    file_meta.MediaStorageSOPClassUID = '1.2.840.10008.5.1.4.1.1.2' # CT Image Storage
    file_meta.MediaStorageSOPInstanceUID = pydicom.uid.generate_uid()
    file_meta.ImplementationClassUID = pydicom.uid.generate_uid()
    file_meta.TransferSyntaxUID = ExplicitVRLittleEndian

    # Create the Dataset
    ds = FileDataset(filename, {}, file_meta=file_meta, preamble=b"\0" * 128)

    # Add Patient / Study info
    ds.PatientName = patient_name
    ds.PatientID = "123456"
    ds.ContentDate = datetime.datetime.now().strftime('%Y%m%d')
    ds.ContentTime = datetime.datetime.now().strftime('%H%M%S.%f')
    ds.Modality = modality
    ds.SeriesInstanceUID = pydicom.uid.generate_uid()
    ds.StudyInstanceUID = pydicom.uid.generate_uid()
    ds.FrameOfReferenceUID = pydicom.uid.generate_uid()

    # Image characteristics
    ds.SamplesPerPixel = 1
    ds.PhotometricInterpretation = "MONOCHROME2"
    ds.PixelRepresentation = 0
    ds.HighBit = 15
    ds.BitsStored = 16
    ds.BitsAllocated = 16
    ds.Columns = 512
    ds.Rows = 512
    
    # Generate random pixel data (noise)
    # In a real demo, you could draw a circle here to simulate a body part
    res = np.random.randint(0, 1000, (512, 512), dtype=np.uint16)
    ds.PixelData = res.tobytes()

    ds.save_as(filename)
    print(f"Generated {modality} DICOM: {filename}")

# Generate one for each modality
create_fake_dicom("sample_ct.dcm", modality="CT")
create_fake_dicom("sample_mr.dcm", modality="MR")
create_fake_dicom("sample_nm.dcm", modality="NM")
create_fake_dicom("sample_pt.dcm", modality="PT")
create_fake_dicom("sample_us.dcm", modality="US")
create_fake_dicom("sample_xr.dcm", modality="XR")