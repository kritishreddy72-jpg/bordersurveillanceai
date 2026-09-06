# AURA-BORDER AI - Dataset Research & Benchmark References

This document details the standard public research datasets mapped to each operational condition in the AURA-BORDER AI platform.

---

### 1. Optical & Thermal Video Datasets (Human vs. Wildlife)
* **Teledyne FLIR Thermal (LWIR) Dataset**:
  * 14,000+ annotated thermal infrared frames for detecting human body heat ($37.4^\circ\text{C}$) in zero-light night operations.
* **Snapshot Serengeti & Caltech Camera Traps (LILA BC)**:
  * Camera-trap imagery of wild quadrupeds (wolves, deer, leopards) used to evaluate false alarm reduction and silent SMS dispatching.
* **MS COCO (Perimeter Subset)**:
  * Baseline benchmark for YOLOv10 object detection distinguishing `person` from non-threatening `wildlife` classes.

---

### 2. Subsurface Acoustic & Seismic Waveform Datasets
* **Google AudioSet & ESC-50**:
  * Audio recordings of mechanical excavation, rotary drilling, and manual pickaxe impacts ($80\text{ Hz} - 3.5\text{ kHz}$).
* **Stanford DAS-1 (Fiber-Optic Distributed Acoustic Sensing)**:
  * Strain rate time-series measuring underground shear waves ($V_s = 340\text{ m/s}$) along perimeter fiber installations.
* **USGS Global Seismic Network (GSN)**:
  * Continuous geophone waveform records for background seismic noise filtering.

---

### 3. Atmospheric Vision Filtering (AVF) Fog & Storm Datasets
* **RESIDE (Realistic Single Image Dehazing Dataset)**:
  * Outdoor SOTS benchmark used for validating Koschmieder Atmospheric Scattering inversion and Dark Channel Prior (DCP) restoration.
* **O-HAZE & D-HAZE Outdoor Benchmark**:
  * Real paired foggy versus clear outdoor photography.
