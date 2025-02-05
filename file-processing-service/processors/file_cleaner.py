import pandas as pd
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def clean_file(input_path, output_path):
    if input_path.endswith(".csv"):
        df = pd.read_csv(input_path)
    else:
        df = pd.read_excel(input_path)

    # Drop duplicates
    df = df.drop_duplicates()

    # Remove empty rows
    df = df.dropna(how="all")

    # Save the cleaned file
    if input_path.endswith(".csv"):
        df.to_csv(output_path, index=False)
    else:
        df.to_excel(output_path, index=False)

    logger.info(f"Cleaned file saved to {output_path}")

