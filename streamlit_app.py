import streamlit as st

st.title("Event Check-in and Label Printing")

@st.experimental_route('/checkin/', methods=['POST'])  # Let op de aangepaste route
def handle_checkin():
    data = st.json()
    action = data.get('action', '')
    if action == 'barcode.checked_in':
        attendee_name = data.get('barcode', {}).get('ticket_class_name', 'Unknown')
        st.write(f"New check-in: {attendee_name}")
        # Voeg hier je label afdrukcode toe

# Run streamlit app
if __name__ == "__main__":
    st.experimental_run_app(__file__, port=8501)
