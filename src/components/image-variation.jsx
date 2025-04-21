const handleGenerateVariations = async () => {
  try {
    setError(null);
    setLoading(true);

    // Validate inputs
    if (!selectedImage) {
      setError('Please select an image to generate variations');
      setLoading(false);
      return;
    }

    if (numVariations < 1 || numVariations > 4) {
      setError('Number of variations must be between 1 and 4');
      setLoading(false);
      return;
    }

    // Generate variations
    const imageUrls = await generateImageVariation(selectedImage, numVariations);
    console.log('Generated variation URLs:', imageUrls);

    // Add the generated variations to the list
    setGeneratedVariations(prev => [...prev, ...imageUrls.map((url, index) => ({
      id: Date.now() + index,
      url,
      originalImage: selectedImage,
    }))]);

    setLoading(false);
  } catch (err) {
    console.error('Error generating variations:', err);
    setError(`Failed to generate variations: ${err.message}`);
    setLoading(false);
  }
}; 