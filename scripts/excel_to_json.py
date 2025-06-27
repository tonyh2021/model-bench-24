import sys
import pandas as pd
import json

if len(sys.argv) < 2:
    print("Usage: python excel_to_json.py <input_file.xlsx> [<rank_file.xlsx>]")
    sys.exit(1)

excel_file = sys.argv[1]
rank_file = sys.argv[2] if len(sys.argv) >= 3 else None
output_file = 'performance.json'

# Read all sheets
sheets = pd.read_excel(excel_file, sheet_name=None)  # Returns a dictionary {sheet_name: DataFrame}

# Combine all sheet data into one large DataFrame
combined_df = pd.concat(sheets.values(), ignore_index=True)

# Convert 'id' column to string type if it exists
if 'id' in combined_df.columns:
    combined_df['id'] = combined_df['id'].astype(str)

# Convert to JSON and write to file
json_data = combined_df.to_json(orient='records', indent=2, force_ascii=False)
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(json_data)

# Generate model.json with model_id as name
if 'model_id' in combined_df.columns:
    model_data = combined_df[['model_id']].drop_duplicates()
    model_data = model_data.rename(columns={'model_id': 'name'})
    
    # Add default fields
    default_fields = {
        'citation': '-',
        'slides': '-',
        'patches': '-',
        'parameters': '-',
        'architecture': '-',
        'pretraining_strategy': '-',
        'pretraining_data_source': '-',
        'stain': '-',
        'released_date': '-',
        'publication': '-'
    }
    
    # Add default fields to each row
    for field, value in default_fields.items():
        model_data[field] = value
        
    model_data['rank'] = 0
    
    if rank_file:
        try:
            rank_df = pd.read_excel(rank_file)
            if 'model_id' in rank_df.columns and 'rank' in rank_df.columns:
                rank_map = dict(zip(rank_df['model_id'], rank_df['rank']))
                model_data['rank'] = model_data['name'].map(rank_map).fillna(0).astype(int)
                print("✅ Rank data merged into model.json")
            else:
                print("⚠️  Rank file does not contain 'model_id' and 'rank' columns. Skipping rank merge.")
        except Exception as e:
            print(f"⚠️  Error reading rank file: {e}. Skipping rank merge.")
    
    model_json = model_data.to_json(orient='records', indent=2, force_ascii=False)
    
    with open('model.json', 'w', encoding='utf-8') as f:
        f.write(model_json)
    print(f"Model data has been written to model.json")

print(f"JSON data has been written to {output_file}")